import {JetView} from "webix-jet";
import {contacts} from "../models/contactsdata";
import {statuses} from "../models/statusesdata";
import {activities} from "../models/activitiesdata";
import FilesDataTable from "./filestable";
import ContactActivitiesTable from "./contactactivitiestable";


export default class ContactInfo extends JetView{
	config(){

		const contactTemplate = {
			view: "template",
			localId: "contactTemplate",
			template: obj =>  `
                <div class="contacts-container">
                    <div class="main_info">
                        <h2 class="username">${obj.FirstName  || "-"} ${obj.LastName  || "-"}</h2>
                        <image class="userphoto" src="${obj.Photo || "https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png"}" />
                        <p class="status">${obj.status || "-"}</p>
                    </div>
                    <div class="addition_info">
                        <p><span class="useremail mdi mdi-email"></span> email: ${obj.Email || "-"}</p>
                        <p><span class="userskype mdi mdi-skype"></span> skype: ${obj.Skype || "-"}</p>
                        <p><span class="userjob mdi mdi-tag"></span> job: ${obj.Job || "-"}</p>
                        <p><span class="usercompany mdi mdi-briefcase"></span> company ${obj.Company || "-"}</p>
                        <p><span class="userbirthday webix_icon wxi-calendar"></span> day of birth: ${obj.Birthday || "-"}</p>
                        <p><span class="userlocation mdi mdi-map-marker"></span> location: ${obj.Address || "-"}</p>
                    </div>
                </div>
            `
		};

		const contactTabbar = {
			view: "tabbar",
			multiview: true,
			localID: "tabbar",
			options: [
				{
					value: "Activities",
					id: "contact:activities"
				},
				{
					value: "Files",
					id: "contact:files"
				}
			],
			height: 50
		};

		const contactTabbarElements = {
			animate: false,
			cells: [
				ContactActivitiesTable,
				FilesDataTable
			]
		};

		const buttons = {
			
			width: 200,
			css: "contact_buttons_bg",
			margin: 10,
			padding: 10,
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
				value: "Edit",
				icon:"mdi mdi-calendar-edit",
				localId: "editButton",
				css: "webix_primary",
				click: () => {
					const value = this.$$("editButton").getValue();
					this.getParentView().showContactForm({}, value, "Save");
				}
			},
			{}
			]
		};

		return { 	
			rows: [
				{ cols:
							[
								contactTemplate,
								buttons
							]
				},
				contactTabbar,
				contactTabbarElements
			]
		};
	}

	ready(view) {
		const grid = view.queryView({view:"datatable"});
		grid.hideColumn("ContactID");
	}
    
	urlChange() {
		const template = this.$$("contactTemplate");
		webix.promise.all([
			contacts.waitData,
			statuses.waitData,
			activities.waitData
		]).then(() => {
			const id = this.getParam("id", true);
			let values = webix.copy(contacts.getItem(id));
			values.status = statuses.getItem(values.StatusID).Value;
			if (values) { template.setValues(values); }
			if (id && contacts.exists(id)) {
				activities.data.filter( obj => obj.ContactID.toString() === id );
			}
		});
	}

	deleteRow() {
		const id = this.getParam("id", true);
		if(id && contacts.exists(id)){
			webix.confirm({
				text: "The contact will be deleted.<br/> Are you sure?"
			}).then(() => {
				contacts.remove(id);
				let firstId = contacts.getFirstId();
				this.getRoot().getParentView().queryView("list").select(firstId);
				const connectedActivities = activities.find( obj => obj.ContactID.toString() === id );
				connectedActivities.forEach((activity) => {
					activities.remove(activity.id);
				});
			});
		}
	}
}