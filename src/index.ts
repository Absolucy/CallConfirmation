import {getModule} from "aliucord-api/dist/modules/module";
import {showDialog} from "aliucord-api/dist/modules/dialog";

const channelModule = getModule((m) => m.default?.getChannel);

var callModule = getModule(
	(m) => m.default?.call && m.default?.ring && m.default?.stopRinging
);

const _call = callModule.default.call;
callModule.default.call = (...args) => {
	const channelID = args[0];
	const channel = channelModule.default.getChannel(channelID);
	let name;

	if (channel.type == 3) {
		name = channel.name;

		if (name.trim() === "") {
			name = channel.rawRecipients.map((user) => user.username).join(", ");
		}
	} else {
		const user = channel.rawRecipients[0];
		name = `${user.username}#${user.discriminator}`;
	}

	showDialog({
		title: "Call?",
		body: `Are you sure you want to start a call with ${name}?`,
		confirmText: "Yes, start the call",
		cancelText: "Nope, that was an accident",
		onConfirm: () => {
			_call(args);
		},
		onCancel: () => {},
	});
};
