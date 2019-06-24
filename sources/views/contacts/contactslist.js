import {JetView} from "webix-jet";
import {contacts} from "../../models/contactsdata";

export default class ContactsView extends JetView{
	config(){
		return {
			view:"list", localId: "list", width:250, select:true, css: "persons_list",
			type:{
				template:obj => `
                <image class="contactphoto" src="${obj.Photo}" />
                <div class="text">
                    <span class="contactname">${obj.FirstName} ${obj.LastName}</span>
                    <span class="contactjob">${obj.Job}</span>
                </div>
                `,
				height:66
			},
			on: {
				onAfterSelect: (id) => {
					this.show(`../contacts?id=${id}`);
				}
			}
		};
	}
	init(view) {
		view.sync(contacts);

		contacts.waitData.then(() => {
			let list = this.$$("list");
			let id = this.getParam("id");
			if (!id || !contacts.exists(id)) { id = contacts.getFirstId(); }
			if (id) { list.select(id); }
		});
	}
}