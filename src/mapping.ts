import { BigInt } from "@graphprotocol/graph-ts";
import {
	Oracle,
	AuthorizedSendersAdded,
	AuthorizedSendersRemoved,
	CancelOracleRequest,
	ConfirmationCommitted,
	OracleRequest,
	OracleResponse,
	OwnershipTransferred,
	RequestConfirmed,
	Staked,
	Withdrawn,
} from "../generated/Oracle/Oracle";
import { Request } from "../generated/schema";
//import { ReqConfirmed } from "../generated/schema";
import { ConfirmationCommittment } from "../generated/schema";

export function handleAuthorizedSendersAdded(
	event: AuthorizedSendersAdded
): void {}

export function handleAuthorizedSendersRemoved(
	event: AuthorizedSendersRemoved
): void {}

export function handleCancelOracleRequest(event: CancelOracleRequest): void {}

//===================
export function handleConfirmationCommitted(
	event: ConfirmationCommitted
): void {

	let confirmationcommitted = ConfirmationCommittment.load(
		event.params.requestId.toHex()
	);

	if (!confirmationcommitted) {
		confirmationcommitted = new ConfirmationCommittment(
			event.params.requestId.toHex()
		);
	}

	confirmationcommitted.sender = event.params.node;
	confirmationcommitted.request = event.params.requestId.toHex();
	confirmationcommitted.data = event.params.scoreData;
	confirmationcommitted.save();
}



//===================
export function handleOracleRequest(event: OracleRequest): void {
	let request = Request.load(event.params.requestId.toHex());

	if (!request) {
		request = new Request(event.params.requestId.toHex());
	}

	request.specId = event.params.specId;
	request.sender = event.params.sender;
	request.payment = event.params.payment;
	request.callbackFunctionId = event.params.callbackFunctionId;
	request.callbackAddress = event.params.account;
	request.cancelExpiration = event.params.cancelExpiration;

	request.save();
}

export function handleOracleResponse(event: OracleResponse): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
//===============
export function handleRequestConfirmed(event: RequestConfirmed): void {
	let request = Request.load(event.params.requestId.toHex());

	if (!request) {
		request = new Request(event.params.requestId.toHex());
	}

	request.finalData = event.params.finalData;

	request.save();
}

export function handleStaked(event: Staked): void {}

export function handleWithdrawn(event: Withdrawn): void {}
