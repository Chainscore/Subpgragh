import { BigInt } from "@graphprotocol/graph-ts";
import {
  ChainScore,
  AuthorizedSendersAdded,
  AuthorizedSendersRemoved,
  CancelRequest,
  ConfirmationCommitted,
  NewRequest,
  OwnershipTransferred,
  RequestConfirmed,
  Staked,
  Withdrawn,
} from "../generated/ChainScore/ChainScore";
import { Request } from "../generated/schema";
//import { ReqConfirmed } from "../generated/schema";
import { ConfirmationCommittment } from "../generated/schema";
import {
  getOrCreateConfirmation,
  getOrCreateCS,
  getOrCreateRequest,
  getOrCreateSpec,
  getOrCreateUser,
  getOrCreateValidator,
} from "./helpers";

export function handleAuthorizedSendersAdded(
  event: AuthorizedSendersAdded
): void {}

export function handleAuthorizedSendersRemoved(
  event: AuthorizedSendersRemoved
): void {}

export function handleCancelRequest(event: CancelRequest): void {}

//===================
export function handleConfirmationCommitted(
  event: ConfirmationCommitted
): void {
  let conf = getOrCreateConfirmation(event.params.requestId, event);
  conf.sender = getOrCreateValidator(event.params.node, event).id;
  conf.request = event.params.requestId;
  conf.data = event.params.data;
  conf.save();
}

//===================
export function handleNewRequest(event: NewRequest): void {
  let request = getOrCreateRequest(event.params.requestId, event);

  request.spec = getOrCreateSpec(event.params.specId).id;
  request.sender = getOrCreateUser(event.params.sender).id;
  request.payment = event.params.payment;
  request.callbackFunctionId = event.params.callbackFunctionId;
  request.address = event.params.account;
  request.expiration = event.params.cancelExpiration;
  request.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  let c = getOrCreateCS();
  c.owner = event.params.newOwner;
  c.save();
}
//===============
export function handleRequestConfirmed(event: RequestConfirmed): void {
  let request = getOrCreateRequest(event.params.requestId, event);

  request.confirmed = true;
  request.finalData = event.params.finalData;
  request.save();
}

export function handleStaked(event: Staked): void {}

export function handleWithdrawn(event: Withdrawn): void {}
