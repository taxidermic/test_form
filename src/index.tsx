
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, TextInputChangeEventData, DatePickerIOS, DatePickerAndroid, Modal, Dimensions, SafeAreaView, VirtualizedList, Picker, TouchableWithoutFeedback, Alert } from 'react-native';
import validator from 'validator'
import { PASS_COUNTRY } from '../nationalities';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { connect } from 'react-redux';
import { setName, setSurname, setNationality, setBirthdate, setGender, setDocumentType, setDocumentSerial, setDocumentNumber, setIssuedAt } from '../actions';
import NationalityPicker from './components/NationalityPicker';
import DocumentPicker, { Document } from './components/DocumentPicker';

const SCREEN_HEIGHT = Dimensions.get('screen').height
interface ICellProps {
    style?: any
    title: string
    children: any
}
const Cell = (props: ICellProps) => {
    return (
        <View style={[styles.cell, props.style]}>
            <Text style={styles.cellTitle}>{props.title}</Text>
            <View>
                {props.children}
            </View>
        </View>
    )
}

type IProps = {
    setName: (name: string) => void
    setNationality: (code: string) => void
    setSurname: (surname: string) => void
    setBirthdate: (birthdate: number) => void
    setGender: (gender: string) => void
    setDocumentType: (type: string) => void
    setDocumentSerial: (serial: string) => void
    setDocumentNumber: (number: string) => void
    setIssuedAt: (issuedAt: number) => void
};
interface IState {
    countries: { label: string, code: string }[]
    isSerialValid: boolean
    isNumberValid: boolean
    isNameValid: boolean
    isSurnameValid: boolean
    name: string
    surname: string
    nationalityInput: string
    birthDate: Date
    issuedAt?: Date
    selectedDoc: 'international' | 'domestic' | 'birth'
    selectedNationality: { label: string, code: string }
    selectedSex: 'male' | 'female'
    serialDoc: string
    numberDoc: string
    showDocPicker: boolean
    showNationalityPicker: boolean
    showSendModal: boolean
    showDatePicker: boolean
    showIssuedAtPicker: boolean
}

class MainScreen extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        props.setBirthdate(new Date().valueOf())
        this.state = {
            birthDate: new Date(),
            countries: PASS_COUNTRY,
            name: '',
            nationalityInput: '',
            numberDoc: '',
            isNameValid: false,
            isNumberValid: false,
            isSerialValid: false,
            issuedAt: undefined,
            isSurnameValid: false,
            selectedDoc: 'domestic',
            selectedNationality: PASS_COUNTRY[0],
            selectedSex: 'female',
            serialDoc: '',
            showDatePicker: false,
            showDocPicker: false,
            showIssuedAtPicker: false,
            showNationalityPicker: false,
            showSendModal: false,
            surname: '',
        }
    }
    handleSurnameChange = (value: string) => {
        if (validator.isAlpha(value, 'ru-RU') || validator.isAlpha(value) || value === '') {
            this.setState({ surname: value.toLocaleUpperCase(), isSurnameValid: value.length > 0 });
        }
    }
    handleNameChange = (value: string) => {
        if (validator.isAlpha(value, 'ru-RU') || validator.isAlpha(value) || value === '') {
            this.setState({ name: value.toLocaleUpperCase(), isNameValid: value.length > 0 });
        }
    }
    handleDocumentChange = (selectedDoc: IState['selectedDoc']) => {
        this.props.setDocumentType(selectedDoc)
        if (selectedDoc === 'international') {
            const tommorow = new Date()
            tommorow.setDate(tommorow.getDate() + 1)
            this.props.setIssuedAt(tommorow.valueOf())
        } else {
            this.props.setIssuedAt(0)
        }
        this.setState({ selectedDoc, showDocPicker: false }, () => {
            this.handleSerialChange(this.state.serialDoc)
            this.handleNumberChange(this.state.numberDoc)
        })
    }

    showDatePicker = (entity?: string) => {
        if (entity === 'passport') {
            const tommorow = new Date()
            tommorow.setDate(tommorow.getDate() + 1)
            this.props.setIssuedAt(tommorow.valueOf())
            this.setState({ showIssuedAtPicker: true, issuedAt: tommorow })
        } else {
            this.props.setIssuedAt(0)
            this.setState({ showDatePicker: true, issuedAt: undefined })
        }
    }
    handleSerialChange = (serialDoc: string) => {
        let isSerialValid = false
        let idx = 0
        switch (this.state.selectedDoc) {
            case 'birth': {
                if (serialDoc.length > 0 && /^(M{0,2})(D?C{0,2}|C[DM])(L?X{0,2}|X[LC])(V?I{0,2}|I[VX])$/i.test(serialDoc.charAt(idx))) {
                    idx++
                    if (idx < serialDoc.length && /^(M{0,2})(D?C{0,2}|C[DM])(L?X{0,2}|X[LC])(V?I{0,2}|I[VX])$/i.test(serialDoc.charAt(idx))) {
                        idx++
                        if (idx < serialDoc.length && /[а-я]/i.test(serialDoc.charAt(idx))) {
                            if (/^[a-z][a-z][а-я][а-я]$/i.test(serialDoc) || /^[a-z][a-z][а-я]$/i.test(serialDoc)) {
                                isSerialValid = true
                            }
                        }
                    } else if (/[а-я]/i.test(serialDoc.charAt(idx))) {
                        if (/^[a-z][а-я][а-я]$/i.test(serialDoc) || /^[a-z][а-я]$/i.test(serialDoc)) {
                            isSerialValid = true
                        }
                    }
                }
                break
            }
            case 'domestic': {
                if (/^[0-9]{4}$/.test(serialDoc)) {
                    isSerialValid = true
                }
                break
            }
            case 'international': {
                if (/^[0-9]{2}$/.test(serialDoc)) {
                    isSerialValid = true
                }
                break
            }
        }

        this.setState({ serialDoc: serialDoc.toLocaleUpperCase(), isSerialValid })
    }
    handleNumberChange = (numberDoc: string) => {
        let isNumberValid = false
        switch (this.state.selectedDoc) {
            case ('birth' && 'domestic'): {
                if (/^\d{6}$/.test(numberDoc)) {
                    isNumberValid = true
                }
                break
            }
            case 'international': {
                if (/^\d{7}$/.test(numberDoc)) {
                    isNumberValid = true
                }
                break
            }
        }
        this.setState({ numberDoc, isNumberValid })
    }
    handleReset = () => {
        this.setState({
            countries: PASS_COUNTRY,
            isNameValid: false,
            isNumberValid: false,
            isSerialValid: false,
            isSurnameValid: false,
            name: '',
            nationalityInput: '',
            birthDate: new Date(),
            issuedAt: new Date(),
            selectedDoc: 'domestic',
            selectedNationality: PASS_COUNTRY[0],
            selectedSex: 'female',
            serialDoc: '',
            numberDoc: '',
            showDatePicker: false,
            showIssuedAtPicker: false,
            showDocPicker: false,
            showNationalityPicker: false,
            surname: '',
        })
        this.props.setBirthdate(new Date().valueOf())
        this.props.setDocumentNumber('')
        this.props.setDocumentSerial('')
        this.props.setDocumentType('domestic')
        this.props.setGender('female')
        this.props.setIssuedAt(0)
        this.props.setName('')
        this.props.setNationality(PASS_COUNTRY[0].code)
        this.props.setSurname('')
    }
    hideNationalityModal = () => this.setState({ showNationalityPicker: false })

    handleSelectNationality = (selectedNationality: { label: string, code: string }) => {
        this.props.setNationality(selectedNationality.code)
        this.setState({ selectedNationality, showNationalityPicker: false })
    }
    renderDatePicker = () => {
        if (this.state.showDatePicker === false && this.state.showIssuedAtPicker === false) return null
        if (Platform.OS === 'ios') {
            let props
            const date = new Date()
            if (this.state.showIssuedAtPicker === true) {
                date.setDate(date.getDate() + 1)
                props = { minimumDate: date }
            } else {
                props = { maximumDate: date }
            }
            return (
                <Modal transparent={true}>
                    <View style={{ marginTop: SCREEN_HEIGHT / 3, backgroundColor: 'white' }}>
                        <DatePickerIOS date={this.state.showDatePicker ? this.state.birthDate : this.state.issuedAt} mode='date' onDateChange={(newDate: Date) => {
                            this.state.showDatePicker ? this.props.setBirthdate(newDate.valueOf()) : this.props.setIssuedAt(newDate.valueOf())
                            if (this.state.showDatePicker === true) {
                                this.setState({ birthDate: newDate })
                            } else {
                                this.setState({ issuedAt: newDate })
                            }
                        }
                        }  {...props} />
                        <TouchableOpacity style={{ alignSelf: 'center', margin: 10 }} onPress={() => this.setState({ showDatePicker: false, showIssuedAtPicker: false })}>
                            <Text style={{ color: colorPalette.clickableTextColor }}>Готово</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            )
        } else {
            DatePickerAndroid.open({
                date: new Date()
            }).then(({ action, year, month, day }) => {
                if (action !== DatePickerAndroid.dismissedAction) {
                    const newDate = new Date(year, month, day)
                    this.state.showDatePicker ? this.props.setBirthdate(newDate.valueOf()) : this.props.setIssuedAt(newDate.valueOf())
                    this.state.showDatePicker ? this.setState({ birthDate: newDate, showDatePicker: false }) : this.setState({ issuedAt: newDate, showDatePicker: false })
                } else {
                    this.setState({ showDatePicker: false })
                }

            })
            return null
        }
    }
    render() {
        console.log('render')
        return (
            <SafeAreaView style={styles.parentWrapper}>
                <KeyboardAwareScrollView style={styles.scrollView}>
                    {this.renderDatePicker()}
                    <Text style={styles.mainHeader}>Данные пассажиров</Text>
                    <View style={styles.secondaryWrapper}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.secondaryHeader}>1. Пассажир(взрослый)</Text>
                            <TouchableOpacity style={{ justifyContent: 'center' }} onPress={this.handleReset}>
                                <Text style={{ color: colorPalette.clickableTextColor }}>Очистить</Text>
                            </TouchableOpacity>
                        </View>
                        <Cell title={'Фамилия'}>
                            <TextInput maxLength={20} numberOfLines={1} textContentType='familyName' style={this.state.isSurnameValid ? styles.formInput : styles.formInputRequired} placeholder={"Как в паспорте"} value={this.state.surname} onChangeText={this.handleSurnameChange} onEndEditing={() => this.props.setSurname(this.state.surname)} />
                            {!this.state.isSurnameValid ? <Text style={styles.warningText}>Поле обязательно к заполнению</Text> : <Text> </Text>}
                        </Cell>
                        <Cell title={'Имя'}>
                            <TextInput maxLength={20} numberOfLines={1} textContentType='name' style={this.state.isNameValid ? styles.formInput : styles.formInputRequired} placeholder={"Как в паспорте"} value={this.state.name} onChangeText={this.handleNameChange} onEndEditing={() => this.props.setName(this.state.name)} />
                            {!this.state.isNameValid ? <Text style={styles.warningText}>Поле обязательно к заполнению</Text> : <Text> </Text>}
                        </Cell>
                        <Cell title={'Дата Рождения'}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.dateInput}>
                                    <Text onPress={this.showDatePicker} >{formatMonthDate(this.state.birthDate.getDate() + '')}</Text >
                                </View>
                                <View style={[styles.dateInput, { marginHorizontal: 10 }]}>
                                    <Text onPress={this.showDatePicker} >{formatMonthDate(this.state.birthDate.getMonth() + 1 + '')}</Text>
                                </View>
                                <View style={styles.dateInput}>
                                    <Text onPress={this.showDatePicker} >{this.state.birthDate.getFullYear()}</Text>
                                </View>
                            </View>
                        </Cell>
                        <Cell title={'Пол'}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={this.state.selectedSex === 'male' ? styles.maleSelected : styles.maleUnselected}
                                    onPress={() => {
                                        this.props.setGender('male')
                                        this.setState({ selectedSex: 'male' })
                                    }}>
                                    <Text>М</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.selectedSex === 'female' ? styles.femaleSelected : styles.femaleUnselected}
                                    onPress={() => {
                                        this.props.setGender('female')
                                        this.setState({ selectedSex: 'female' })
                                    }}>
                                    <Text>Ж</Text>
                                </TouchableOpacity>
                            </View>
                        </Cell>
                        <Cell title={'Гражданство'}>
                            <TouchableOpacity onPress={() => this.setState({ showNationalityPicker: true })}>
                                <View style={styles.pickerForm} >
                                    <Text>{this.state.selectedNationality.label}</Text>
                                    <View>
                                        <View style={{ flex: 1 }} />
                                        <View style={styles.triangle} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <NationalityPicker show={this.state.showNationalityPicker} hideModal={this.hideNationalityModal} handleSelect={this.handleSelectNationality} />
                        </Cell>
                        <Cell title={'Документ'}>
                            <TouchableOpacity onPress={() => this.setState({ showDocPicker: true })}>
                                <View style={styles.pickerForm}>
                                    <Text>{Document[this.state.selectedDoc]}</Text>
                                    <View>
                                        <View style={{ flex: 1 }} />
                                        <View style={styles.triangle} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <DocumentPicker selectedDoc={this.state.selectedDoc} show={this.state.showDocPicker} handleDocumentChange={this.handleDocumentChange} />
                        </Cell>

                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <Cell style={{ flex: 1, marginRight: 10 }} title={'Серия'}>
                                    <TextInput style={this.state.isSerialValid ? styles.formInput : styles.formInputRequired} value={this.state.serialDoc} onChangeText={this.handleSerialChange} onEndEditing={() => this.props.setDocumentSerial(this.state.serialDoc)} />
                                </Cell>
                                <Cell style={{ flex: 2 }} title={'Номер'}>
                                    <TextInput style={this.state.isNumberValid ? styles.formInput : styles.formInputRequired} value={this.state.numberDoc} onChangeText={this.handleNumberChange} onEndEditing={() => this.props.setDocumentNumber(this.state.numberDoc)} />
                                </Cell>
                            </View>
                            <Text style={styles.warningText}>{this.state.isSerialValid === false ? 'Неверно введена серия' : ' '}</Text>
                            <Text style={styles.warningText}>{this.state.isNumberValid === false ? 'Неверно введен серийный номер' : ' '}</Text>
                        </View>

                        {
                            this.state.selectedDoc === 'international'
                                ? (
                                    <Cell title={'Срок действия'}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={styles.dateInput}>
                                                <Text onPress={() => this.showDatePicker('passport')} >{formatMonthDate(this.state.issuedAt.getDate() + '')}</Text >
                                            </View>
                                            <View style={[styles.dateInput, { marginHorizontal: 10 }]}>
                                                <Text onPress={() => this.showDatePicker('passport')} >{formatMonthDate(this.state.issuedAt.getMonth() + 1 + '')}</Text>
                                            </View>
                                            <View style={styles.dateInput}>
                                                <Text onPress={() => this.showDatePicker('passport')} >{this.state.issuedAt.getFullYear()}</Text>
                                            </View>
                                        </View>
                                    </Cell>
                                )
                                : null
                        }
                        <TouchableOpacity onPress={() => {
                            if (this.state.isNameValid && this.state.isSurnameValid && this.state.isSerialValid && this.state.isNumberValid) {
                                this.setState({ showSendModal: true })
                            } else {
                                Alert.alert('Ошибка', 'Заполните все обязательные поля!')
                            }
                        }
                        }>
                            <View style={{ alignSelf: 'center', margin: 8 }}>
                                <Text style={{ color: colorPalette.clickableTextColor }}>Отправить</Text>
                            </View>
                        </TouchableOpacity>
                        {this.state.showSendModal ? (
                            <Modal>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text>{JSON.stringify(this.props.state)}</Text>
                                    <TouchableOpacity onPress={() => this.setState({ showSendModal: false })}>
                                        <Text>Закрыть</Text>
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                        ) : null}
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}
function formatMonthDate(date: string): string {
    if (date.length === 1) {
        return '0' + date
    }
    return date
}

const colorPalette = {
    borderColor: 'rgb(177, 205, 214)',
    clickableTextColor: 'rgb(90, 194, 248)',
    selectedGenderColor: 'rgb(140, 153, 172)',
    warningColor: 'rgb(251,119,67)',
}
const styles = StyleSheet.create({
    cell: {
        marginVertical: 9,
    },
    cellTitle: {
        marginBottom: 10,
    },
    femaleSelected: {
        backgroundColor: colorPalette.selectedGenderColor,
        flex: 1,
        padding: 10,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        alignItems: 'center',
    },
    femaleUnselected: {
        backgroundColor: 'white',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colorPalette.borderColor,
        flex: 1,
        padding: 10,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        alignItems: 'center',
    },
    dateInput: {
        backgroundColor: 'white',
        borderColor: colorPalette.borderColor,
        padding: 10,
        borderRadius: 5,
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        alignItems: 'center',
    },
    formInput: {
        backgroundColor: 'white',
        borderColor: colorPalette.borderColor,
        padding: 10,
        borderRadius: 5,
        borderWidth: StyleSheet.hairlineWidth,
    },
    formInputRequired: {
        borderColor: colorPalette.warningColor,
        backgroundColor: 'rgb(249, 233, 226)',
        padding: 10,
        borderRadius: 5,
        borderWidth: StyleSheet.hairlineWidth,
    },
    mainHeader: {
        fontSize: 17,
        marginVertical: 10,
    },
    maleSelected: {
        backgroundColor: colorPalette.selectedGenderColor,
        flex: 1,
        padding: 10,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        alignItems: 'center',
    },
    maleUnselected: {
        backgroundColor: 'white',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colorPalette.borderColor,
        flex: 1,
        padding: 10,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        alignItems: 'center',
    },
    parentWrapper: {
        flex: 1,
        backgroundColor: 'white',
    },
    pickerForm: {
        backgroundColor: 'rgb(251, 251, 251)',
        borderColor: colorPalette.borderColor,
        padding: 10,
        borderRadius: 5,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    secondaryWrapper: {
        backgroundColor: 'rgb(244,243,243)',
        borderRadius: 10,
        padding: 10
    },
    scrollView: {
        marginBottom: 20, marginHorizontal: 5
    },
    triangle: {
        borderTopWidth: 8, borderLeftWidth: 5, borderRightWidth: 5,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent', borderTopColor: 'gray', width: 0, height: 0
    },
    secondaryHeader: {
        fontSize: 15,
        marginVertical: 10,
    },
    warningText: {
        color: colorPalette.warningColor,
    },
});

const mapStateToProps = (state) => {
    return {
        state,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setName: (name: string) => {
            dispatch(setName(name))
        },
        setNationality: (nationality: string) => {
            dispatch(setNationality(nationality))
        },
        setSurname: (surname: string) => {
            dispatch(setSurname(surname))
        },
        setBirthdate: (birthdate: number) => {
            dispatch(setBirthdate(birthdate))
        },
        setGender: (gender: string) => {
            dispatch(setGender(gender))
        },
        setDocumentType: (type: string) => {
            dispatch(setDocumentType(type))
        },
        setDocumentSerial: (serial: string) => {
            dispatch(setDocumentSerial(serial))
        },
        setDocumentNumber: (number: string) => {
            dispatch(setDocumentNumber(number))
        },
        setIssuedAt: (issuedAt: number) => {
            dispatch(setIssuedAt(issuedAt))
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen)