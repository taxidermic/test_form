import React from 'react'
import { Modal, TouchableWithoutFeedback, View, TextInput, TouchableOpacity, Text, VirtualizedList, Dimensions, StyleSheet } from 'react-native';
import { PASS_COUNTRY } from '../../nationalities';

const SCREEN_HEIGHT = Dimensions.get('screen').height
interface IProps {
    handleSelect: (item: { label: string, code: string }) => void
    hideModal: () => void
    show: boolean
}
interface IState {
    countries: { label: string, code: string }[]
    nationalityInput: string
}
export default class NationalityPicker extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            countries: PASS_COUNTRY,
            nationalityInput: '',
        }
    }
    render() {
        const { handleSelect, hideModal, show } = this.props
        if (!show) return null
        return (
            <Modal transparent>
                <TouchableWithoutFeedback onPress={hideModal}>
                    <View style={styles.wrapper}>
                        <View style={styles.formWrapper}>
                            <TextInput autoFocus 
                            value={this.state.nationalityInput} style={{ margin: 10 }} 
                            placeholder='Поиск'
                            onChangeText={(nationalityInput) => this.setState({
                                nationalityInput, countries: PASS_COUNTRY.filter((value: { label: string, code: string }) => {
                                    return value.label.startsWith(nationalityInput)
                                }),
                            })} />
                            <VirtualizedList
                                data={this.state.countries}
                                extraData={this.state.countries}
                                keyExtractor={(item) => item.code}
                                getItem={(data, index) => data[index]}
                                getItemCount={data => data.length}
                                renderItem={(value: { item: { label: string, code: string } }) => {
                                    return (
                                        <TouchableOpacity style={{ padding: 10 }} onPress={() => handleSelect(value.item)}>
                                            <Text>{value.item.label}</Text>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    formWrapper: {
        backgroundColor: 'white', 
        borderRadius: 10,
    },
    wrapper: {
        flex: 1,
        backgroundColor: 'rgba(100,100,100,0.3)',
        paddingHorizontal: 30,
        paddingTop: SCREEN_HEIGHT / 5,
        paddingBottom: 10,
    }
})