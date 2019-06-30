import {JetView} from "webix-jet";
import ActivitiesDataTable from "./activities/activitiestable";
import ActivityWindow from "./activities/activityform";
import {contacts} from "../models/contactsdata";
import {statuses} from "../models/statusesdata";
import {activities} from "../models/activitiesdata";


export default class ContactInfo extends JetView{
	config(){
		const contactTemplate = {
			view: "template",
			id: "contact:template",
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
                        <p><span class="userbirthday webix_icon wxi-calendar"></span> day of birth: ${obj.InfoBirthday || "-"}</p>
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
					id: "activities:datatable"
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
				ActivitiesDataTable,
				{id: "contact:files", template: "Upload files"}
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
				icon:"mdi mdi-calendar-edit",
				css: "webix_primary",
				click: () => {
					this.getParentView().showForm({}, "Edit", "Save");
				}
			},
			{}
			]
		};

		const addActivityBtn = {	
			view:"toolbar", css:"subbar", padding:0,
			elements:[
				{},
				{
					view: "button",
					label: "Add",
					localId: "addButton",
					type:"icon",
					value: "Add activity",
					icon: "wxi-plus",
					css: "webix_primary bg_color",
					align: "right",
					inputWidth: 200,
					click: () => {
						this.form.showForm({}, "Add", "Add");
					}
				}
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
				contactTabbarElements,
				addActivityBtn
			]
		};
	}

	ready(view) {
		const grid = view.queryView({view:"datatable"});
		grid.hideColumn("ContactID");
	}

	init() {
		this.form = this.ui(ActivityWindow);

		this.on(this.app, "activities:save", values => {
			values.id ? activities.updateItem(values.id, values) : activities.add(values);
		});

		this.on(this.app,"activities:delete", id => activities.remove(id));
	}
    
	urlChange(view) {
		const template = this.$$("contact:template");
		webix.promise.all([
			contacts.waitData,
			statuses.waitData,
			activities.waitData
		]).then(() => {
			const id = this.getParentView().getSelected();
			let values = webix.copy(contacts.getItem(id));
			const grid = view.queryView({view:"datatable"});
			values.status = statuses.getItem(values.StatusID).Value;
			if (values) { template.setValues(values); }
			if (id && contacts.exists(id)) {
				grid.sync(activities, function () {
					this.filter( data => data.ContactID.toString() === id );
				});
			}
		});
	}

	deleteRow() {
		const id  = webix.$$("contacts:list").getSelectedId();
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