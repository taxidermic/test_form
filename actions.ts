export const SET_NAME = 'app/set_name/';
export const SET_SURNAME = 'app/set_surname/';
export const SET_NATIONALITY = 'app/set_nationality/';
export const SET_BIRTHDATE = 'app/set_birthdate';
export const SET_GENDER = 'app/set_gender';
export const SET_DOCUMENT_TYPE = 'app/set_document_type';
export const SET_DOCUMENT_SERIAL = 'app/set_document_serial';
export const SET_DOCUMENT_NUMBER = 'app/set_document_number';
export const SET_ISSUED_AT = 'app/set_issued_at';

export function setName (value: string) {
    return {type: SET_NAME, payload: {value}}
}
export function setSurname (value: string) {
    return {type: SET_SURNAME, payload: {value}}
}
export function setNationality (value: string) {
    return {type: SET_NATIONALITY, payload: {value}}
}
export function setBirthdate (value: number) {
    return {type: SET_BIRTHDATE, payload: {value}}
}
export function setGender(value: string) {
    return {type: SET_GENDER, payload: {value}}
}
export function setDocumentType(value: string){
    return {type: SET_DOCUMENT_TYPE, payload: {value}}
}
export function setDocumentSerial(value: string){
    return {type: SET_DOCUMENT_SERIAL, payload: {value}}
}
export function setDocumentNumber(value: string){
    return {type: SET_DOCUMENT_NUMBER, payload: {value}}
}
export function setIssuedAt(value: number) {
    return {type: SET_ISSUED_AT, payload: {value}}
}
