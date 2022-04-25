import { clearStore, test, assert } from 'matchstick-as/assembly/index'

import { handleNewRequest } from "../src/mapping";
import { newCancel, newRequest, newCommittment } from "./helpers/events"

const client1 = "0x0eD6a1F7a99E8Bc1c752E4515f7AB3aFe20BdBF7";
const client2 = "0x4ac97E172A28c363206D12C04da0ca5F2CcF6781";

const specId1 = "0x4d9511e33b70551bba5e65560ed6214c9345fb74230b2d75785339a63dc8df1b" // ethers.utils.id("specId1")
const specId2 = "0x3e0b6d82f2c8a071a17b67b7164b1eff07468c7ed30337bf80e3d843d2f3f0be" // ethers.utils.id("specId2")

const requestId1 = "0x9e423d9106d020212e343b95646196e32584e0cc1095d5280c9539b32e6ac59e" // ethers.utils.id(ethers.utils.defaultAbiCoder.encode([ "address", "uint" ], [ client1, 1 ]))
const requestId2 = "0x5ec38616bd5602f4d6520043ec02eef34c17f8912ed7ac6ef497d4798d2558c8" // ethers.utils.id(ethers.utils.defaultAbiCoder.encode([ "address", "uint" ], [ client1, 2 ]))
const requestId3 = "0x7e4b0be4fdbd083378ad944501ebf302f46d9b9dac1cff5ef10f412bb850a070" // ethers.utils.id(ethers.utils.defaultAbiCoder.encode([ "address", "uint" ], [ client2, 1 ]))
const requestId4 = "0xad0dabee470bb270394d66799538020c0dedf7e9a77f8c01bd13e1d153600c26" // ethers.utils.id(ethers.utils.defaultAbiCoder.encode([ "address", "uint" ], [ client2, 2 ]))
const requestId5 = "0xdfece8c09b6c6721e88e389ad45215eeb80045ead25f3a1e659d1084ba30f3c5" // ethers.utils.id(ethers.utils.defaultAbiCoder.encode([ "address", "uint" ], [ client2, 3 ]))

const node1 = "0xf916784C4374e3C8919bA64c51877A0A3EB78341";
const node2 = "0x52FAaB2825404bF8d3042E2649649a4aE749eC26";
const node3 = "0xB66B9A01b0EA575cD6fa6f3075a99fe25c7c0c0d";
const node4 = "0x4322Fb2fe149C48B851e9803EE922C7b2B14b7F2";
const node5 = "0x766F13321B26DFEC7f39d284f7102e1af84a2735";

test('Should create new request', () => {
    let request = newRequest(client1, specId1, requestId1, "1000000000000000000", "0x4ac97E17", "1650899226702", client1);
    handleNewRequest(request);
})