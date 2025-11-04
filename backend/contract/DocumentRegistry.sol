// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentRegistry {
    struct Document {
        string docHash;
        address issuer;
        uint256 timestamp;
        bool exists;
    }

    mapping(string => Document) private documents;

    event DocumentRegistered(string docId, string docHash, address issuer, uint256 timestamp);

    function registerDocument(string memory docId, string memory docHash) public {
        require(bytes(docId).length > 0, "docId required");
        require(bytes(docHash).length > 0, "docHash required");
        documents[docId] = Document(docHash, msg.sender, block.timestamp, true);
        emit DocumentRegistered(docId, docHash, msg.sender, block.timestamp);
    }

    function verifyDocument(string memory docId, string memory docHash) public view returns (bool) {
        Document memory doc = documents[docId];
        if (!doc.exists) return false;
        return keccak256(abi.encodePacked(doc.docHash)) == keccak256(abi.encodePacked(docHash));
    }

    function getDocument(string memory docId)
        public
        view
        returns (string memory, address, uint256, bool)
    {
        Document memory d = documents[docId];
        return (d.docHash, d.issuer, d.timestamp, d.exists);
    }
}
