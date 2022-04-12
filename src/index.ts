import {Plugin, registerPlugin} from "enmity-api/plugins";
import {User, Channel} from "enmity-api/common";
import {getModule} from "enmity-api/module";
import {instead} from "enmity-api/patcher";
import {showDialog} from "enmity-api/dialog";

const channelModule = getModule((m) => m.default?.getChannel);
var callModule = getModule(
	(m) => m.default?.call && m.default?.ring && m.default?.stopRinging
);

const CallConfirmation: Plugin = {
	name: "CallConfirmation",
	patches: [
		instead(
			"CallConfirmation",
			callModule.default,
			"call",
			(_self, args, res) => {
				const channelID: string = args[0];
				const channel: Channel = channelModule.default.getChannel(channelID);
				let name: string;

				if (channel.type == 3) {
					name = channel.name;

					if (name.trim() === "") {
						name = channel.rawRecipients
							.map((user) => user.username)
							.join(", ");
					}
				} else {
					let user: User = channel.rawRecipients[0];
					name = `${user.username}#${user.discriminator}`;
				}

				showDialog({
					title: "Call?",
					body: `Are you sure you want to start a call with ${name}?`,
					confirmText: "Yes, start the call",
					cancelText: "Nope, that was an accident",
					onConfirm: () => {
						res(...args);
					},
					onCancel: () => {},
				});
			}
		),
	],
	onStart: () => {},
	onStop: () => {},
};

registerPlugin(CallConfirmation);
