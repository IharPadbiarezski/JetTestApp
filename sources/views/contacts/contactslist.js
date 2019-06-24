import {JetView} from "webix-jet";
import {contacts} from "../../models/contactsdata";

export default class ContactsView extends JetView{
	config(){
		return {
			view:"list", width:250, select:true, css: "persons_list",
			type:{
				template:obj => `
                <image class="userphoto" src="${obj.Photo}" />
                <div class="text">
                    <span class="username">${obj.FirstName} ${obj.LastName}</span>
                    <span class="userjob">${obj.Job}</span>
                </div>
                `,
				height:66
			}
		};
	}
	init(view) {
		view.sync(contacts);
	}
}