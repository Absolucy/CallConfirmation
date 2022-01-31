import {getModule} from "aliucord-api/dist/modules/module";
import {getUser} from "aliucord-api/dist/modules/users";
import {showDialog} from "aliucord-api/dist/modules/dialog";

var callModule = getModule(
	(m) => m.default?.call && m.default?.ring && m.default?.stopRinging
);

const _call = callModule.default.call;
callModule.default.call = (id, unk1, isManaged, recipientId, onCall) => {
	getUser(`${recipientId}`).then((user) => {
		showDialog({
			title: "Call?",
			body: `Are you sure you want to start a call with ${user.username}#${user.discriminator}?`,
			confirmText: "Yes, start the call",
			cancelText: "Nope, that was an accident",
			onConfirm: function () {
				_call(id, unk1, isManaged, recipientId, onCall);
			},
			onCancel: function () {},
		});
	});
};
