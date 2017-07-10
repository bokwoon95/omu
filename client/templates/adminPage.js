Template.adminPage.helpers({
	'currentMeteorUserId' : function() {
		return Meteor.userId();
	},

	'currentRestaurantCode' : function() {
		const rcode = OmuIRTV.findOne({
			meteorUserId: Meteor.userId()
		}).rcode;
		return rcode;
	},

	'currentTableAmt' : function() {
		const noOftables = OmuIRTV.find({
			meteorUserId: Meteor.userId()
		}).count();
		return noOftables;
	},

	'menulist' : function() {
		const Rcode = OmuIRTV.findOne({
			meteorUserId: Meteor.userId()
		}).rcode;
		return MenuList.find(
			{ restCode: Rcode },
			{sort: { menuitem: 1} }
		);
	},
});

Template.adminPage.events({
	'submit form': function(event) {
		event.preventDefault();
		const Rcode = event.target.Rcode.value;
		event.target.Rcode.value="";
		console.log("new rcode is: " + Rcode);

		const SOC = StandingOrders.find().count();
		const COC = ConfirmedOrders.find().count();
		if (SOC == 0 && COC == 0) {
			Meteor.call('updateRcode', {
			  meteorId: Meteor.userId(),
			  newRcode: Rcode,
			}, (err, res) => {
			  if (err) {
				alert(err);
			  } else {
				console.log("success");
			  }
			});
		} else {
			document.getElementById("editRcodeError").innerHTML = "Note: You can only edit your Restaurant Code if there are no more pending or confirmed orders in your restaurant"
		}
  	},

	'click .addTable': function() {
		const TC = OmuIRTV.find({
			meteorUserId: Meteor.userId()
		}).count();
		const rnum = Math.floor(Math.random() * (9999 - 0 + 1)) + 0;
		const doesRcodeExist = OmuIRTV.find(
			{ meteorUserId: Meteor.userId(),
				rcode: { $exists: true } }
		).count();
		console.log("TC: " + TC);
		console.log("rnum: " + rnum);
		console.log("rcode no: " + doesRcodeExist);
		document.getElementById("removeErrorMsg").innerHTML = ""
		if (doesRcodeExist == 0) {
			OmuIRTV.insert({
				meteorUserId: Meteor.userId(),
				tablenum: (TC+1),
				vcode: rnum,
			});
		} else {
			const Rcode = OmuIRTV.findOne(
				{ meteorUserId: Meteor.userId() }
			).rcode;
			console.log(Rcode);
			OmuIRTV.insert({
				meteorUserId: Meteor.userId(),
				rcode: Rcode,
				tablenum: (TC+1),
				vcode: rnum,
			});
		}
	},

	'click .removeTable': function() {
		const SOC = StandingOrders.find().count();
		const COC = ConfirmedOrders.find().count();
		const TC = OmuIRTV.find({
			meteorUserId: Meteor.userId()
		}).count();
		if (SOC == 0 && COC == 0 && TC > 1) {
			const table_id = OmuIRTV.findOne({
				meteorUserId: Meteor.userId(),
				tablenum: TC,
			})._id;
			console.log(table_id);
			OmuIRTV.remove({ _id: table_id });
		} else {
			document.getElementById("removeErrorMsg").innerHTML = "Note: You can only remove tables if there are no more pending orders or customers in your restaurant"
		}
	},

	'click .menuDel': function() {
		const SOC = StandingOrders.find().count();
		const COC = ConfirmedOrders.find().count();

		if (SOC == 0 && COC == 0) {
			const documentId = this._id;
			MenuList.remove({ _id: documentId });
		} else {
			document.getElementById("deleteMenuError").innerHTML = "Note: You can only delete menu items if there are no more orders in your restaurant"
		}
	},
});

// const ran = (Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0,5));
//
// const doesRcodeExist = OmuIRTV.find({
// 	meteorUserId: Meteor.userId(),
// 	// rcode: { $exists: true },
// }).count();
// console.log("rcode" + doesRcodeExist);
// if (doesRcodeExist == 0) {
// 	console.log("dicks");
// }
// const temp = OmuIRTV.findOne(
// 	{ meteorUserId: Meteor.userId() },
// 	// { fields: { rcode: 1 } },
// );
// return temp.rcode;
