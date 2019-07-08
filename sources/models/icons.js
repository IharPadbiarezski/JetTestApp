function getIcon(icon){
	return `<span class="webix_icon wxi-${icon}"></span> ${icon}`;
} 
export const icons = new webix.DataCollection({
	scheme:{
		$init: (obj) => {
			obj.value = getIcon(obj.Value);
		}
	},
	data: [
		{id: "1", Value: "calendar"},
		{id: "2", Value: "check"},
		{id: "3", Value: "clock"},
		{id: "4", Value: "pencil"},
		{id: "5", Value: "close"},
		{id: "6", Value: "sync"},
		{id: "7", Value: "alert"},
		{id: "8", Value: "eye"},
		{id: "9", Value: "eye-slash"}
	]
});
