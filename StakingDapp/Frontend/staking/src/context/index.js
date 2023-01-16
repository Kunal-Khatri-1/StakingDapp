import React, { useContext, createContext, useState } from "react";
import { ethers } from "ethers";
import {
  StakingAbi,
  RewardTokenAbi,
  StakingAddress,
  RewardTokenAddress,
} from "../constants";
import { useEffect } from "react";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState();
  const [signer, setSigner] = useState();
  const [stakingContract, setStakingContract] = useState();
  const [rewardTokenContract, setRewardTokenContract] = useState();

  const connectMetamask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // connect to the metamask
        await window.ethereum.request({ method: "eth_requestAccounts" });
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        // getting the address connected to the node provider
        const signerConnectedToProvider = provider.getSigner();
        setSigner(signerConnectedToProvider);

        const address = await signerConnectedToProvider.getAddress();
        setConnectedAddress(address);

        setStakingContract(
          new ethers.Contract(
            StakingAddress,
            StakingAbi,
            signerConnectedToProvider
          )
        );

        setRewardTokenContract(
          new ethers.Contract(
            RewardTokenAddress,
            RewardTokenAbi,
            signerConnectedToProvider
          )
        );

        localStorage.setItem("account", address);
        setIsConnected(true);

        window.ethereum.on("disconnect", () => {
          localStorage.setItem("account", "");
          setConnectedAddress("");
          setIsConnected(false);
        });

        window.ethereum.on("accountsChanged", async (newAccount) => {
          setIsConnected(false);

          setConnectedAddress(newAccount[0]);

          const newSigner = provider.getSigner();
          setSigner(newSigner);

          setStakingContract(
            new ethers.Contract(StakingAddress, StakingAbi, newSigner)
          );

          setRewardTokenContract(
            new ethers.Contract(RewardTokenAddress, RewardTokenAbi, newSigner)
          );

          localStorage.setItem("account", newAccount);

          setIsConnected(true);
        });
      } catch (error) {
        alert("Problem connecting Metamask");
        console.log(error);
      }
    } else {
      alert("Please install Metamask wallet and try again");
      setIsConnected(false);
    }
  };

  useEffect(() => {
    const account = localStorage.getItem("account");
    if (account) {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      // getting the address connected to the node provider
      const signerConnectedToProvider = provider.getSigner();
      setSigner(signerConnectedToProvider);

      setStakingContract(
        new ethers.Contract(
          StakingAddress,
          StakingAbi,
          signerConnectedToProvider
        )
      );

      setRewardTokenContract(
        new ethers.Contract(
          RewardTokenAddress,
          RewardTokenAbi,
          signerConnectedToProvider
        )
      );

      setConnectedAddress(account);
      setIsConnected(true);
    }
  }, []);

  const getRewardRate = async () => {
    try {
      const rewardRate = await stakingContract.getRewardRate();
      return ethers.utils.formatEther(rewardRate);
    } catch (error) {
      alert("Couldn't fetch reward rate, check console for error");
      console.log(error);
    }
  };

  const getTotalStakedAmount = async () => {
    try {
      const totalStakedAmount = await stakingContract.getTotalStakedTokens();
      return ethers.utils.formatEther(totalStakedAmount);
    } catch (error) {
      alert("Couldn't fetch total tokens staked, check console for error");
      console.log(error);
    }
  };

  const getUserReward = async () => {
    try {
      const userReward = await stakingContract.getReward(connectedAddress);
      return ethers.utils.formatEther(userReward);
    } catch (error) {
      alert("Couldn't fetch rewards earned, check console for error");
      console.log(error);
    }
  };

  const getStakedAmount = async () => {
    try {
      const userStakedAmount = await stakingContract.getStakedAmount(
        connectedAddress
      );
      return ethers.utils.formatEther(userStakedAmount);
    } catch (error) {
      alert("Couldn't fetch staked amount, check console for error");
      console.log(error);
    }
  };

  const userStake = async (amountOfTokens) => {
    try {
      const approveTransactionResponse = await rewardTokenContract.approve(
        StakingAddress,
        ethers.utils.parseEther(amountOfTokens)
      );
      await approveTransactionResponse.wait(1);

      const transactionResponse = await stakingContract.stake(
        ethers.utils.parseEther(amountOfTokens)
      );
      await transactionResponse.wait(1);
      alert(
        `Successfully staked ${ethers.utils.formatEther(
          amountOfTokens
        )} Reward Tokens`
      );
    } catch (error) {
      alert("Coudn't stake tokens, check console for error");
      console.log(error);
    }
  };

  const userUnstake = async (amountOfTokens) => {
    try {
      const transactionResponse = await stakingContract.withdraw(
        ethers.utils.parseEther(amountOfTokens)
      );
      await transactionResponse.wait(1);
      alert(
        `Successfully unstaked ${ethers.utils.formatEther(
          amountOfTokens
        )} Reward Tokens`
      );
    } catch (error) {
      alert("Couldn't unstake tokens, check console for error");
      console.log(error);
    }
  };

  const claimRewardTokens = async () => {
    try {
      const transactionResponse = await stakingContract.claimReward();
      await transactionResponse.wait(1);
      alert("Sucessfully claimed the Reward");
    } catch (error) {
      alert("Couldn't claim reward, check console for error");
      console.log(error);
    }
  };

  const getRewardTokenBalance = async () => {
    try {
      const balance = await rewardTokenContract.balanceOf(connectedAddress);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      alert("Couldn't get reward token balance, check console for error");
      console.log(error);
    }
  };

  const getFreeTokens = async () => {
    try {
      const transactionResponse = await rewardTokenContract.mintFiveTokens();
      await transactionResponse.wait(1);
      alert("5 ROTE minted to you address!");
    } catch (error) {
      alert("Couldn't get 5 free RETO, check console for error");
      console.log(error);
    }
  };

  return (
    <StateContext.Provider
      value={{
        isConnected,
        signer,
        connectMetamask,
        getRewardRate,
        StakingAddress,
        RewardTokenAddress,
        getTotalStakedAmount,
        getUserReward,
        getStakedAmount,
        connectedAddress,
        stakingContract,
        userStake,
        getRewardTokenBalance,
        userUnstake,
        claimRewardTokens,
        rewardTokenContract,
        getFreeTokens,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
