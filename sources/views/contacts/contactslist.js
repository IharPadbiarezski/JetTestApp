import {JetView} from "webix-jet";
import {contacts} from "../../models/contactsdata";
import {activities} from "../../models/activitiesdata";

export default class ContactsView extends JetView{
	config(){

		const add_button = {
			view: "button",
			label: "Add contact",
			localId: "addButton",
			autoheight: true,
			type:"icon",
			value: "Add",
			icon: "wxi-plus",
			css: "webix_primary",
			align: "center",
			inputWidth: 200,
			click: () => {		
				this.list.unselect();
				this.app.callEvent("contactform:show", ["Add"]);
			}
		};

		const contact_list = {
			view:"list",
			localId: "list",
			borderless: true,
			scroll: "auto",
			width:250,
			select:true,
			css: "persons_list",
			type:{
				template:obj => `
                <image class="contactphoto" src="${obj.Photo || "https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png"}" />
                <div class="text">
                    <span class="contactname">${obj.FirstName || "-"} ${obj.LastName || "-"}</span>
                    <span class="contactjob">${obj.Job || "-"}</span>
                </div>
                `,
				height:66
			},
			on: {
				onAfterSelect: (id) => {					
					this.setParam("id", id, true);
					this.app.callEvent("contactinfo:show", [id]);
				}				
			}
		};

		return {
			css:"contact_buttons_bg",
			rows: [
				contact_list,
				{gravity: 0.05},
				add_button
			]
		};
	}
	init() {
		
		this.list = this.$$("list");
		this.list.sync(contacts);

		contacts.waitData.then(() => {
			let id = this.getParam("id");
			
			if (!id || !contacts.exists(id)) { 
				id = contacts.getFirstId(); 
			}
			
			if (id && id !== this.list.getSelectedId()) { 
				this.list.select(id);
			}
		});

		this.on(this.app, "contact:delete", () => {
			this.deleteRow();
		});		
	}

	deleteRow() {
		const id = this.getParam("id");

		if(id && contacts.exists(id)){
			webix.confirm({
				text: "The contact will be deleted.<br/> Are you sure?"
			}).then(() => {
				contacts.remove(id);
				let firstId = contacts.getFirstId();
				this.$$("list").select(firstId);
				const connectedActivities = activities.find( obj => obj.ContactID.toString() === id );
				connectedActivities.forEach((activity) => {
					activities.remove(activity.id);
				});
			});
		}
	}
}