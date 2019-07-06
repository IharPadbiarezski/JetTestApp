import {JetView} from "webix-jet";
import CommonTableForSettings from "./commonTableForSetting";
import { activitytypes } from "../models/activitytypesdata";
import { statuses } from "../models/statusesdata";

export default class SettingsView extends JetView {
	config() {
		const lang = this.app.getService("locale").getLang();
		const _ = this.app.getService("locale")._;

		const selector = {
			view: "segmented",
			inputWidth: 250,
			id: "lng",
			options: [
				{id: "en", value: _("EN")},
				{id: "ru", value: _("RU")}
			],
			click: () => this.toggleLanguage(),
			value: lang
		};

		return {
			rows: [
				selector,
				{
					cols: [
						{$subview: new CommonTableForSettings(this.app, "", activitytypes, "activityTypesTable", "Activity Types", "Icon", "Add type", "value")},
						{$subview: new CommonTableForSettings(this.app, "", statuses, "statusesTable", "Status", "Icon", "Add status", "name")}
					]
				}
			]
		};
	}

	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.$$("lng").getValue();
		langs.setLang(value);
	}
}
