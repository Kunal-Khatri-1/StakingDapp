import React from "react";
import { useState } from "react";
import { useStateContext } from "../context";
import { useEffect } from "react";
// import { loader } from "../svgs";

const Staking = () => {
  const {
    connectMetamask,
    isConnected,
    getRewardRate,
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
  } = useStateContext();

  const [rewardRate, setRewardRate] = useState(0);
  const [totalStakedAmount, setTotalStakedAmount] = useState(0);
  const [userReward, setUserReward] = useState(0);
  const [userStakedAmount, setUserStakedAmount] = useState(0);
  const [stakeAmount, setStakeAmount] = useState("");
  const [unStakeAmount, setUnStakeAmount] = useState("");
  const [rewardTokenBalance, setRewardTokenBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [reFetchRequired, setRefetchRequired] = useState(false);

  const connect = async () => {
    setIsLoading(true);
    await connectMetamask();
    setIsLoading(false);
  };

  const fetchRewardRate = async () => {
    setIsLoading(true);
    const fetchedRewardRate = await getRewardRate();
    setRewardRate(fetchedRewardRate);
    setIsLoading(false);
  };

  const fetchTotalStakedAmount = async () => {
    setIsLoading(true);
    const fetchedTotalStakedAmount = await getTotalStakedAmount();
    setTotalStakedAmount(fetchedTotalStakedAmount);
    setIsLoading(false);
  };

  const fetchUserReward = async () => {
    setIsLoading(true);
    const fetchedUserReward = await getUserReward();
    setUserReward(fetchedUserReward);
    setIsLoading(false);
  };

  const fetchUserStakedAmount = async () => {
    setIsLoading(true);
    const fetchedUserStakedAmount = await getStakedAmount();
    setUserStakedAmount(fetchedUserStakedAmount);
    setIsLoading(false);
  };

  const fetchRewardTokenBalance = async () => {
    setIsLoading(true);
    const fetchedRewardTokenBalance = await getRewardTokenBalance();
    setRewardTokenBalance(fetchedRewardTokenBalance);
    setIsLoading(false);
  };

  const stakeTokens = async (amountOfTokens) => {
    setIsLoading(true);
    await userStake(amountOfTokens);
    setRefetchRequired(true);
    setIsLoading(false);
  };

  const unStakeTokens = async (amountOfTokens) => {
    setIsLoading(true);
    await userUnstake(amountOfTokens);
    setRefetchRequired(true);
    setIsLoading(false);
  };

  const claimReward = async () => {
    setIsLoading(true);
    await claimRewardTokens();
    setRefetchRequired(true);
    setIsLoading(false);
  };

  const getFiveTokens = async () => {
    setIsLoading(true);
    await getFreeTokens();
    setRefetchRequired(true);
    setIsLoading(false);
  };

  useEffect(() => {
    console.log(
      rewardTokenContract,
      stakingContract,
      isConnected,
      connectedAddress
    );
    if (stakingContract && rewardTokenContract && connectedAddress) {
      fetchRewardRate();
      fetchTotalStakedAmount();
      fetchUserReward();
      fetchUserStakedAmount();
      fetchRewardTokenBalance();

      setRefetchRequired(false);
    } else {
      console.log("Something is off");
    }
  }, [stakingContract, rewardTokenContract, reFetchRequired]);

  const getTruncatedAddress = () => {
    const startString = connectedAddress.substring(0, 5);
    const middleString = "...";
    const endingIndex = connectedAddress.length - 1;
    const endingString = connectedAddress.substring(
      endingIndex - 3,
      endingIndex
    );
    const truncatedAddress = startString + middleString + endingString;

    return truncatedAddress;
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center font-sans text-white bg-gradient-to-b from-pink-200 to-[#fed6e3];">
      {isLoading && (
        <div className="flex flex-row justify-center items-center w-full h-full absolute backdrop-blur-[3px]">
          {/* <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-cover"
          /> */}
          <h1 className=" text-bold text-3xl">Loading...</h1>
        </div>
      )}

      <div>
        <div className=" bg-black bg-opacity-70 p-10 rounded-xl shadow-md min-w-[650px]">
          <div className="flex flex-row justify-between items-center">
            <h1 className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              STAKE RETO
            </h1>
            <div
              className={`ml-8 bg-purple-500 hover:bg-purple-700 ${
                isConnected ? "hover:bg-purple-700" : "bg-purple-500"
              } rounded-md w-36 font-semibold leading-7 hover:hover:border-[1px] border-purple-300`}
            >
              {isConnected && connectedAddress ? (
                <button className="w-full h-full py-1">
                  {getTruncatedAddress()}
                </button>
              ) : (
                <button
                  className="w-full h-full py-1 border-purple-300"
                  onClick={connect}
                >
                  Connect
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-row justify-around items-center mt-8 gap-32">
            <div className="flex flex-row justify-center items-center">
              <span className="text-lg font-bold">Total Staked: &nbsp;</span>
              <p className="text-lg text-pink-500">
                {" "}
                {isConnected && connectedAddress ? totalStakedAmount : 0} ROTE
              </p>
            </div>
            <div className="flex flex-row justify-center items-center">
              <span className="text-lg font-bold">Reward Rate: &nbsp;</span>
              <p className="text-lg text-pink-500">
                {" "}
                {isConnected && connectedAddress ? rewardRate : 0} ROTE/sec
              </p>
            </div>
          </div>
          <hr />
          <div>
            <div className="mt-8 w-full">
              <div className="flex flex-row justify-start items-center leading-8">
                <span className="font-semibold basis-1/2 text-left">
                  Your Reward: &nbsp;
                </span>

                <p className=" ml-11">
                  {isConnected && connectedAddress
                    ? Math.round(userReward * 1000) / 1000
                    : 0}
                  &nbsp; ROTE*
                </p>
              </div>
              <div className="flex flex-row justify-start items-center leading-8">
                <span className="font-semibold basis-1/2 text-left">
                  Your Balance: &nbsp;
                </span>

                <p className=" ml-11">
                  {isConnected && connectedAddress
                    ? Math.round(rewardTokenBalance * 1000) / 1000
                    : 0}
                  &nbsp; ROTE
                </p>
              </div>
              <div className="flex flex-row justify-start items-center leading-8">
                <span className="font-semibold basis-1/2 text-left">
                  Staked Amount: &nbsp;
                </span>

                <p className=" ml-11">
                  {isConnected && connectedAddress
                    ? Math.round(userStakedAmount * 1000) / 1000
                    : 0}
                  &nbsp; ROTE
                </p>
              </div>
            </div>

            <div>
              <div className="mt-8 flex flex-row justify-between items-center h-[25px]">
                <div>
                  <input
                    type="number"
                    name="stake"
                    id="stake"
                    min="0"
                    step="0.01"
                    placeholder="3.14 ROTE"
                    value={stakeAmount}
                    onChange={(event) => setStakeAmount(event.target.value)}
                    className=" bg-white text-gray-800 rounded-l-md border-none w-24 font-medium text-base px-1 py-1"
                  />
                  <button
                    className="bg-purple-500 hover:bg-purple-700 font-semibold px-1 rounded-r-md w-20 py-1 hover:border-[1px] border-purple-300 box-border"
                    onClick={() => stakeTokens(stakeAmount)}
                  >
                    Stake
                  </button>
                </div>

                <div>
                  <input
                    type="number"
                    name="unStake"
                    id="unStake"
                    min="0"
                    step="0.01"
                    placeholder="3.14 ROTE"
                    value={unStakeAmount}
                    onChange={(event) => setUnStakeAmount(event.target.value)}
                    className=" bg-white text-gray-800 rounded-l-md border-none w-24 font-medium text-base px-1 py-1"
                  />
                  <button
                    className="bg-purple-500 hover:bg-purple-700 font-semibold px-1 rounded-r-md w-20 py-1 hover:border-[1px] border-purple-300 box-border"
                    onClick={() => unStakeTokens(unStakeAmount)}
                  >
                    Unstake
                  </button>
                </div>

                <button
                  className="bg-purple-500 hover:bg-purple-700 font-semibold rounded-md w-20 py-1 px-1 hover:border-[1px] border-purple-300 box-border"
                  onClick={() => claimReward()}
                >
                  Claim
                </button>
              </div>
            </div>
          </div>
        </div>
        <p className=" text-gray-700 text-sm absolute bottom-2 left-2 text-left">
          Switch to{" "}
          <span className="text-gray-800 font-bold text-lg ">
            Goerli Testnet
          </span>
          <br />
          <span className="text-gray-800 font-bold text-lg">
            Connect Metamask and{" "}
          </span>
          <button
            className="bg-purple-500 hover:bg-purple-700 font-semibold rounded-md w-20 py-1 px-1 hover:border-[1px] border-purple-300 box-border text-white"
            onClick={() => getFiveTokens()}
          >
            GET ROTE
          </button>
          <br />
          *Rewards shown based on when the page was loaded, latest balance can
          be viewed by reloading the page
        </p>
      </div>
    </div>
  );
};

export default Staking;
