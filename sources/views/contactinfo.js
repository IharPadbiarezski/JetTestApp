import {JetView} from "webix-jet";
import {contacts} from "../models/contactsdata";
import {statuses} from "../models/statusesdata";


export default class ContactInfo extends JetView{
	config(){
		return { 
			cols: [
				{
					view: "template",
					id: "contact:template",
					template: obj =>  `
                            <div class="contacts-container">
                                <div class="main_info">
                                    <h2 class="username">${obj.FirstName} ${obj.LastName}</h2>
                                    <image class="userphoto" src="${obj.Photo ? obj.Photo : "https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png"}" />
                                    <p class="status">${this.status}</p>
                                </div>
                                <div class="addition_info">
                                    <p><span class="useremail mdi mdi-email"></span> email: ${obj.Email}</p>
                                    <p><span class="userskype mdi mdi-skype"></span> skype: ${obj.Skype}</p>
                                    <p><span class="userjob mdi mdi-tag"></span> job: ${obj.Job}</p>
                                    <p><span class="usercompany mdi mdi-briefcase"></span> company ${obj.Company}</p>
                                    <p><span class="userbirthday webix_icon wxi-calendar"></span> day of birth: ${obj.Company}</p>
                                    <p><span class="userlocation mdi mdi-map-marker"></span> location: ${obj.Address}</p>
                                </div>
                            </div>
                    `
				},

				{css: "bg_color",
					gravity: 0.4,
					rows: [{
						view: "button",
						label: "Delete",
						type:"icon",
						icon: "wxi-trash",
						css: "webix_primary",
						click: () => {
							this.deleteRow();
						}
					},
					{
						view: "button",
						label: "Edit",
						type:"icon",
						icon:"mdi mdi-calendar-edit",
						css: "webix_primary",
						click: () => {
						}
					},
					{}
					]
				}
			]
		};
	}

	init() {
		
	}
    
	urlChange() {
		const id = this.getParentView().getSelected();
		const template = this.$$("contact:template");
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			const values = contacts.getItem(id);
			this.status = statuses.getItem(values.StatusID).Value;
			if (values) { template.setValues(values); }
		});
	}

	deleteRow() {
		const id  = webix.$$("contacts:list").getSelectedId();
		if(id){
			webix.confirm({
				text: "The contact will be deleted.<br/> Are you sure?"
			}).then(() => {
				contacts.remove(id);
				webix.message({type: "success", text: "The contact is deleted!"});
			});
		}
	}
}