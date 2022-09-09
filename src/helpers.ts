import { BigDecimal, BigInt, Bytes, dataSource, ethereum } from "@graphprotocol/graph-ts";
import { ConfirmationCommittment, Request, User, Transaction, Validator, Spec, ChainScore, ChainScoreDayData } from '../generated/schema';

export const BI_ZERO = BigInt.fromI32(0)
export const BI_ONE = BigInt.fromI32(1)
export const BD_ZERO = BigDecimal.fromString("0")
export const BD_ONE = BigDecimal.fromString("1")
export const BY_ZERO = Bytes.fromI32(0)

export function getOrCreateCS(): ChainScore {
    let controller = ChainScore.load(BY_ZERO);

    if(!controller){
        controller = new ChainScore(BY_ZERO)
        controller.address = dataSource.address()
        controller.totalRequestCount = BI_ZERO
        controller.totalUserCount = BI_ZERO
        controller.totalValidatorCount = BI_ZERO
        controller.owner = BY_ZERO
        controller.minConfirmations = 1
        controller.gasPrice = BI_ZERO
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
        controller.requestCount = BI_ZERO
        controller.userCount = BI_ZERO
        controller.validatorCount = BI_ZERO
        controller.save()
    }
    return controller
}

export function getOrCreateRequest(requestId: Bytes, event: ethereum.Event): Request {
    let id = requestId
    let request = Request.load(id);

    if(!request){
        request = new Request(id)
        request.spec = BY_ZERO
        request.sender = BY_ZERO
        request.payment = BI_ZERO
        request.callbackFunctionId = BY_ZERO
        request.address = BY_ZERO
        request.expiration = BI_ZERO
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
        conf.sender = BY_ZERO
        conf.data = BI_ZERO
        conf.request = BY_ZERO
        conf.createdAt = getOrCreateTransaction(event).id
        conf.timestamp = event.block.timestamp.toI32()
        conf.save()
    }
    return conf
}

export function getOrCreateUser(id: Bytes, event: ethereum.Event|null = null): User {
    let user = User.load(id);

    if(!user){
        user = new User(id)
        user.activeSince = BY_ZERO
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
        val.activeSince = BY_ZERO
        val.isAuthorized = false
        val.stake = BI_ZERO
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
        spec.createdAt = BY_ZERO
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