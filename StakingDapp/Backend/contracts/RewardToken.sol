// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Taking staking and reward token to be the same

contract RewardToken is ERC20 {
    constructor() ERC20("Reward Token", "RETO") {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }

    function mintFiveTokens() external {
        _mint(msg.sender, 5 * 10 ** 18);
    }
}
