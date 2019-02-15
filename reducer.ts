import { SET_NAME, SET_SURNAME, SET_NATIONALITY, SET_BIRTHDATE, SET_GENDER, SET_DOCUMENT_TYPE, SET_DOCUMENT_SERIAL, SET_DOCUMENT_NUMBER, SET_ISSUED_AT } from "./actions";
import { PASS_COUNTRY } from "./nationalities";

const initialState = {
  birthdate: 0,
  gender: 'female',
  documentType: 'domestic',
  documentSerial: '',
  documentNumber: '',
  issuedAt: 0,
  name: '',
  nationality: PASS_COUNTRY[0].code,
  surname: '',
}
export default function reducer(state = initialState, action) {
  const value = action.payload && action.payload.value
  switch (action.type) {
    case SET_NAME:
      return { ...state, name: value }
    case SET_SURNAME:
      return { ...state, surname: value }
    case SET_NATIONALITY:
      return { ...state, nationality: value }
    case SET_BIRTHDATE:
      return { ...state, birthdate: value }
    case SET_GENDER:
      return { ...state, gender: value }
    case SET_DOCUMENT_TYPE:
      return { ...state, documentType: value }
    case SET_DOCUMENT_SERIAL:
      return { ...state, documentSerial: value }
    case SET_DOCUMENT_NUMBER:
      return { ...state, documentNumber: value }
    case SET_ISSUED_AT:
      return { ...state, issuedAt: value }
    default:
      return state;
  }
}