import React from 'react'
import { Modal, View, Picker, Dimensions, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('screen').width
interface IProps {
    handleDocumentChange: (itemValue: 'international' | 'domestic' | 'birth') => void
    selectedDoc: any
    show: boolean
}
export enum Document {
    'international' = 'Загранпаспорт',
    'domestic' = 'Паспорт',
    'birth' = 'Свид-во о рождении'
}
export default class DocumentPicker extends React.PureComponent<IProps> {
    render() {
        if (!this.props.show) return null
        if (Platform.OS === 'ios') {
            return (
                <Modal transparent >
                    <View style={styles.parentWrapper}>
                        <View style={styles.formWrapper}>
                            <Picker
                                selectedValue={this.props.selectedDoc}
                                style={styles.picker}
                                onValueChange={this.props.handleDocumentChange}>
                                <Picker.Item label={Document.international} value="international" />
                                <Picker.Item label={Document.domestic} value="domestic" />
                                <Picker.Item label={Document.birth} value="birth" />
                            </Picker>
                        </View>
                    </View>
                </Modal>
            )
        }

        return (
            <Modal transparent >
                <View style={styles.parentWrapper}>
                    <View style={styles.formWrapper}>
                        <TouchableOpacity style={styles.androidButton} onPress={() => this.props.handleDocumentChange('international')}>
                            <Text>{Document.international}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.androidButton}  onPress={() => this.props.handleDocumentChange('domestic')}>
                            <Text>{Document.domestic}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.androidButton}  onPress={() => this.props.handleDocumentChange('birth')}>
                            <Text>{Document.birth}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    androidButton: {
        padding: 10,
    },
    formWrapper: {
        backgroundColor: 'white', padding: 20, borderRadius: 10,
    },
    parentWrapper: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(100,100,100,0.3)',
        alignItems: 'center', justifyContent: 'center'
    },
    picker: {
        width: SCREEN_WIDTH * 0.8,
    },
})