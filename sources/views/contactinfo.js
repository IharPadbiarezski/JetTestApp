import {JetView} from "webix-jet";
import FilesDataTable from "./filestable";
import ContactActivitiesTable from "./contactactivitiestable";
import {contacts} from "../models/contactsdata";
import {statuses} from "../models/statusesdata";
import {activities} from "../models/activitiesdata";
import {icons} from "../models/icons";


export default class ContactInfo extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const contactTemplate = {
			view: "template",
			localId: "contactTemplate",
			template: obj => `
                <div class="contacts-container">
                    <div class="main_info">
                        <h2 class="username">${obj.FirstName || "-"} ${obj.LastName || "-"}</h2>
                        <image class="userphoto" src="${obj.Photo || "https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png"}" />
                        <p class="status"> ${obj.status ? `${obj.icon} ${obj.status}` : "-"}</p>
                    </div>
                    <div class="addition_info">
                        <p><span class="useremail mdi mdi-email"></span> ${_("email")}: ${obj.Email || "-"}</p>
                        <p><span class="userskype mdi mdi-skype"></span> ${_("skype")}: ${obj.Skype || "-"}</p>
                        <p><span class="userjob mdi mdi-tag"></span> ${_("job")}: ${obj.Job || "-"}</p>
                        <p><span class="usercompany mdi mdi-briefcase"></span> ${_("company")} ${obj.Company || "-"}</p>
                        <p><span class="userbirthday webix_icon wxi-calendar"></span> ${_("day of birth")}: ${obj.Birthday || "-"}</p>
                        <p><span class="userlocation mdi mdi-map-marker"></span> ${_("location")}: ${obj.Address || "-"}</p>
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
					value: _("Activities"),
					id: "contact:activities"
				},
				{
					value: _("Files"),
					id: "contact:files"
				}
			],
			height: 50
		};

		const contactTabbarElements = {
			animate: false,
			cells: [
				{
					id: "contact:activities",
					$subview: ContactActivitiesTable
				},
				{
					id: "contact:files",
					$subview: FilesDataTable
				}
			]
		};

		const buttons = {

			width: 200,
			css: "contact_buttons_bg",
			margin: 10,
			padding: 10,
			rows: [{
				view: "button",
				label: _("Delete"),
				type: "icon",
				icon: "wxi-trash",
				css: "webix_primary",
				click: () => {
					this.app.callEvent("contact:delete");
				}
			},
			{
				view: "button",
				label: _("Edit"),
				type: "icon",
				value: "Edit",
				localId: "editButton",
				icon: "mdi mdi-calendar-edit",
				css: "webix_primary",
				click: () => {
					this.app.callEvent("contactform:show");
				}
			},
			{}
			]
		};

		return {
			rows: [
				{cols:
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
		const grid = view.queryView({view: "datatable"});
		grid.hideColumn("ContactID");
	}

	urlChange() {
		const template = this.$$("contactTemplate");
		webix.promise.all([
			contacts.waitData,
			statuses.waitData,
			activities.waitData,
			icons.waitData
		]).then(() => {
			const id = this.getParam("id", true);
			if (id && contacts.exists(id)) {
				let values = webix.copy(contacts.getItem(id));
				if (values.StatusID) {
					const status = statuses.getItem(values.StatusID) || "";
					values.status = status ? status.Value : "";
					const icon = icons.getItem(status.Icon) || "";
					values.icon = icon.value || "";
				}
				template.setValues(values);
			}
		});
	}
}
