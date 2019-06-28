import {JetView} from "webix-jet";
import ContactsList from "./contacts/contactslist";
import ContactInfo from "./contacts/contactinfo";

export default class ContactsView extends JetView {
	config() {
		return {
			cols: [
				ContactsList, ContactInfo
			]
		};
	}
}