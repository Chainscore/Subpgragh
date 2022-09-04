import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { ConfirmationCommittment, Request, User, Transaction, Validator, Spec, ChainScore, ChainScoreDayData } from '../generated/schema';


export function getOrCreateCS(): ChainScore {
    let id = Bytes.fromI32(0)
    let controller = ChainScore.load(id);

    if(!controller){
        controller = new ChainScore(id)
        controller.address = Bytes.fromI32(0)
        controller.totalRequestCount = BigInt.fromI32(0)
        controller.totalUserCount = BigInt.fromI32(0)
        controller.totalValidatorCount = BigInt.fromI32(0)
        controller.owner = Bytes.fromI32(0)
        controller.save()
    }
    return controller
}

export function getOrCreateCSDayData(event: ethereum.Event): ChainScoreDayData {
    let dayId = (event.block.timestamp.toI32() / (24*3600))*(24*3600)
    let id = Bytes.fromI32(dayId)
    let controller = ChainScoreDayData.load(id);

    if(!controller){
        controller = new ChainScoreDayData(id)
        controller.day = dayId
        controller.requestCount = BigInt.fromI32(0)
        controller.userCount = BigInt.fromI32(0)
        controller.validatorCount = BigInt.fromI32(0)
        controller.save()
    }
    return controller
}

export function getOrCreateRequest(requestId: Bytes, event: ethereum.Event): Request {
    let id = event.transaction.hash.concat(requestId).concatI32(event.transactionLogIndex.toI32())
    let request = Request.load(id);

    if(!request){
        request = new Request(id)
        request.spec = Bytes.fromI32(0)
        request.sender = Bytes.fromI32(0)
        request.payment = BigInt.fromI32(0)
        request.callbackFunctionId = Bytes.fromI32(0)
        request.address = Bytes.fromI32(0)
        request.expiration = BigInt.fromI32(0)
        request.confirmed = false
        request.createdAt = getOrCreateTransaction(event).id
        request.timestamp = event.block.timestamp;
        request.save()


        let cd = getOrCreateCSDayData(event)
        cd.requestCount = cd.requestCount.plus(BigInt.fromI32(1))
        cd.save()

        let c = getOrCreateCS()
        c.totalRequestCount = c.totalRequestCount.plus(BigInt.fromI32(1))
        c.save()
    }
    return request
}


export function getOrCreateConfirmation(requestId: Bytes, event: ethereum.Event): ConfirmationCommittment {
    let id = event.transaction.hash.concat(requestId).concatI32(event.transactionLogIndex.toI32())
    let conf = ConfirmationCommittment.load(id);

    if(!conf){
        conf = new ConfirmationCommittment(id)
        conf.sender = Bytes.fromI32(0)
        conf.data = BigInt.fromI32(0)
        conf.request = Bytes.fromI32(0)
        conf.createdAt = getOrCreateTransaction(event).id
        conf.save()
    }
    return conf
}

export function getOrCreateUser(id: Bytes, event: ethereum.Event|null = null): User {
    let user = User.load(id);

    if(!user){
        user = new User(id)
        user.activeSince = Bytes.fromI32(0)
        if(event){
            user.activeSince = getOrCreateTransaction(event).id

            let cd = getOrCreateCSDayData(event)
            cd.userCount = cd.userCount.plus(BigInt.fromI32(1))
            cd.save()
        }
        user.save()

        let c = getOrCreateCS()
        c.totalUserCount = c.totalUserCount.plus(BigInt.fromI32(1))
        c.save()
    }
    return user
}

export function getOrCreateValidator(id: Bytes, event: ethereum.Event | null = null): Validator {
    let val = Validator.load(id);

    if(!val){
        val = new Validator(id)
        val.activeSince = Bytes.fromI32(0)
        if(event){
            val.activeSince = getOrCreateTransaction(event).id

            let cd = getOrCreateCSDayData(event)
            cd.validatorCount = cd.validatorCount.plus(BigInt.fromI32(1))
            cd.save()
        }
        val.save()

        let c = getOrCreateCS()
        c.totalValidatorCount = c.totalValidatorCount.plus(BigInt.fromI32(1))

        c.save()
    }
    return val
}

export function getOrCreateSpec(id: Bytes, event: ethereum.Event|null = null): Spec {
    let spec = Spec.load(id);

    if(!spec){
        spec = new Spec(id)
        spec.createdAt = Bytes.fromI32(0)
        if(event){
            spec.createdAt = getOrCreateTransaction(event).id
        }
        spec.save()
    }
    return spec
}

export function getOrCreateTransaction(event: ethereum.Event): Transaction {
    let id = event.transaction.hash.concatI32(event.transactionLogIndex.toI32());
    let tx = Transaction.load(id);

    if(!tx){
        tx = new Transaction(id)
        tx.timestamp = event.block.timestamp.toI32()
        tx.hash = event.transaction.hash
        tx.save()
    }
    return tx
}