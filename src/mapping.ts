import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  ChainScore,
  AuthorizedSendersAdded,
  AuthorizedSendersRemoved,
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
): void {
  let val = getOrCreateValidator(event.params.sender as Bytes, event);
  val.isAuthorized = true;
  val.save();
}

export function handleAuthorizedSendersRemoved(
  event: AuthorizedSendersRemoved
): void {
  let val = getOrCreateValidator(event.params.sender as Bytes, event);
  val.isAuthorized = false;
  val.save();
}


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

export function handleStaked(event: Staked): void {
  let val = getOrCreateValidator(event.params.sender as Bytes, event);
  val.stake = val.stake.plus(event.params.tokenAmt);
  val.save();
}

export function handleWithdrawn(event: Withdrawn): void {
  let val = getOrCreateValidator(event.params.sender as Bytes, event);
  val.stake = val.stake.minus(event.params.tokenAmt);
  val.save();
}
