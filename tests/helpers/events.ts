/* eslint-disable prefer-const */ // to satisfy AS compiler

import { NewRequest, ConfirmationCommitted, RequestConfirmed, CancelRequest } from '../../generated/ChainScore/ChainScore'

import { newMockEvent } from 'matchstick-as'
import { Address, ethereum, BigInt, ByteArray, Bytes } from '@graphprotocol/graph-ts'

// event NewRequest(
//     address sender, 
//     bytes32 indexed specId, 
//     bytes32 requestId, 
//     uint256 payment, 
//     bytes4 callbackFunctionId, 
//     uint256 cancelExpiration, 
//     address account
// );
export function newRequest(sender: string, specId: string, requestId: string, payment: string, callbackFunctionId: string, cancelExpiration: string, account: string): NewRequest {
  let newRequestEvent = changetype<NewRequest>(newMockEvent())

  let senderParam = new ethereum.EventParam(
    'sender',
    ethereum.Value.fromAddress(Address.fromString(sender.toLowerCase())),
  )

  let specParam = new ethereum.EventParam(
    'specId',
    ethereum.Value.fromBytes(Bytes.fromHexString(specId))
  )

  let requestParam = new ethereum.EventParam(
    'requestId',
    ethereum.Value.fromBytes(Bytes.fromHexString(requestId)),
  )

  let paymentParam = new ethereum.EventParam(
    'payment',
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(payment)),
  )

  let callbackFunctionIdParam = new ethereum.EventParam(
    'callbackFunctionId',
    ethereum.Value.fromBytes(Bytes.fromHexString(callbackFunctionId)),
  )

  let cancelExpirationParam = new ethereum.EventParam(
    'cancelExpiration',
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(cancelExpiration)),
  )

  let accountParam = new ethereum.EventParam(
    'account',
    ethereum.Value.fromAddress(Address.fromString(account.toLowerCase())),
  )

  newRequestEvent.parameters = new Array()
  newRequestEvent.parameters.push(senderParam)
  newRequestEvent.parameters.push(specParam)
  newRequestEvent.parameters.push(requestParam)
  newRequestEvent.parameters.push(paymentParam)
  newRequestEvent.parameters.push(callbackFunctionIdParam)
  newRequestEvent.parameters.push(cancelExpirationParam)
  newRequestEvent.parameters.push(accountParam)

  return newRequestEvent
}


// event ConfirmationCommitted(
//   bytes32 requestId, 
//   address node, 
//   uint256 data
// );
export function newConfirmationCommitted(requestId: string, node: string, data: string): ConfirmationCommitted {
  let newConfirmationEvent = changetype<ConfirmationCommitted>(newMockEvent())

  let requestParam = new ethereum.EventParam(
    'requestId',
    ethereum.Value.fromBytes(ByteArray.fromHexString(requestId)),
  )
  let nodeParam = new ethereum.EventParam(
    'node',
    ethereum.Value.fromAddress(Address.fromString(node.toLowerCase())),
  )
  let dataParam = new ethereum.EventParam(
    'data',
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(data)),
  )

  newConfirmationEvent.parameters = new Array()
  newConfirmationEvent.parameters.push(requestParam)
  newConfirmationEvent.parameters.push(nodeParam)
  newConfirmationEvent.parameters.push(dataParam)

  return newConfirmationEvent
}

// event RequestConfirmed(
//   bytes32 requestId, 
//   uint256 finalData
// );
export function newCommittment(requestId: string, finalData: string): RequestConfirmed {
  let newRequestConfirmedEvent = changetype<RequestConfirmed>(newMockEvent())

  let requestParam = new ethereum.EventParam(
    'requestId',
    ethereum.Value.fromBytes(ByteArray.fromHexString(requestId)),
  )

  let dataParam = new ethereum.EventParam(
    'finalData',
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(finalData)),
  )

  newRequestConfirmedEvent.parameters = new Array()
  newRequestConfirmedEvent.parameters.push(requestParam)
  newRequestConfirmedEvent.parameters.push(dataParam)

  return newRequestConfirmedEvent
}

// event CancelRequest(bytes32 indexed requestId);
export function newCancel(requestId: string): CancelRequest {
  let newCancelEvent = changetype<CancelRequest>(newMockEvent())

  let requestParam = new ethereum.EventParam(
    'requestId',
    ethereum.Value.fromBytes(ByteArray.fromHexString(requestId)),
  )

  newCancelEvent.parameters = new Array()
  newCancelEvent.parameters.push(requestParam)

  return newCancelEvent
}