import {JetView} from "webix-jet";
import {contacts} from "../../models/contactsdata";
import {statuses} from "../../models/statusesdata";


export default class ContactInfo extends JetView{
	config(){
		return { 
			cols: [
				{
					view: "template",
					localId: "template",
					template:(obj) => {
						return `
                            <div class="contacts-container">
                                <div class="main_info">
                                    <h2 class="username">${obj.FirstName} ${obj.LastName}</h2>
                                    <image class="userphoto" src="https://ru.webix.com/demos/doctor-pure-webix/data/photos/gita_1.jpg" />
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
                    `;}
				},

				{css: "bg_color",
					gravity: 0.4,
					rows: [         {
						view: "button",
						label: "Delete",
						type:"icon",
						icon: "wxi-trash",
						css: "webix_primary",
						click: () => {
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
    


	init(){
	}
    
	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			const id = this.getParam("id");
			const values = contacts.getItem(id);
			this.status = statuses.getItem(values.StatusID).Value;
			let template = this.$$("template");
			if (values) { template.setValues(values); }
		});
	}
}