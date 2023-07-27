import React, { useState, useEffect, useRef } from "react";
import { useContractWrite, useContractRead, useAccount } from "wagmi";
import { parseEther } from "viem";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { Input, Spacer, Button, Table } from "@nextui-org/react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Modal } from "@nextui-org/react";
import ContractInterface from "../stakingApprove-abi.json";
import ContractInterface1 from "../stake&Withdraw-abi.json";
import { Tooltip } from "@nextui-org/react";

const Withdraw = (props) => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState();
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const { address } = useAccount();
  const [stakingDetails, setStakingDetails] = useState([]);
  const [id, setId] = useState("");
  const dataFetchedRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState(0);
  const [tx, setTx] = useState(false);
  console.log(props?.props?.id, "to get props here");
  console.log(props?.props?.userId, "to get props here");
  console.log(
    props?.props?.startDate,
    props?.props?.endDate,
    "to get start Date"
  );
  

  const { write: Approval } = useContractWrite({
    mode: "args",
    address: "0x45d12b59b965880c9F8A38eFdBA3075631e70Caf",
    abi: ContractInterface,
    functionName: "approve",
    overrides: {
      gasLimit: 8000000,
    },
    args: [props?.props?.id, parseEther(`${amount}`)],
    onError(error) {
      console.log(error, "error");
      setOpen(false);
    },
    async onSuccess(data) {
      setOpen(true);
      console.log(data, "data");
      let tx = await data.wait();
      console.log(tx, "tx");
      Stake();
    },
  });

  const { write: Stake } = useContractWrite({
    mode: "args",
    address: props?.props?.id,
    abi: ContractInterface1,
    functionName: "Stake",
    overrides: {
      gasLimit: 8000000,
    },
    args: [parseEther(`${userId}`), parseEther(`${amount}`)],
    onError(error) {
      console.log(error, "error");
    },
    async onSuccess(data) {
      setOpen(true);
      var args = [userId, parseEther(`${amount}`)];
      console.log(args, "args to send");
      console.log(data, "data");
      console.log(props?.props.id, "data");
      let tx = await data.wait();
      setOpen(false);
      console.log(tx, "tx");
      if (tx.status == 1) {
        setTx(true);
        setOpen(false);
        getData();
        return;
      }
      // if (
      //   tx.status == 0 &&
      //   new Date().toLocaleString() <
      //     new Date(parseFloat(props?.props?.startDate) * 1000).toLocaleString()
      // ) {
      //   setShow2(true);
      //   setShow1(false);
      //   setShow(false);
      //   return;
      // }
      // if (
      //   tx.status == 0 &&
      //   new Date().toLocaleString() >
      //     new Date(parseFloat(props?.props?.endDate) * 1000).toLocaleString()
      // ) {
      //   setOpen(false);
      //   setShow1(true);
      //   setShow(false);
      //   return;
      // }

      if (tx.status == 0) {
        setOpen(false);
        setShow(true);
        setShow1(false);
        return;
      }
    },
  });

  async function getData() {
    setOpen(true);
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc-mumbai.maticvigil.com"
      );
      console.log(props?.props?.id, "helloooooo");
      const daiContract = new ethers.Contract(
        props?.props?.id,
        ContractInterface1,
        provider
      );
      let arr = [];
      const getStakingId = await daiContract.getUserStakingIds(address);
      console.log(getStakingId.toString(), "to get id");
      const idToPass = getStakingId.toString();
      var sId = idToPass.split(",");
      console.log("SID", sId);
      for (let i = 0; i <= sId.length - 1; i++) {
        console.log("GETING SID", sId[i]);
        const getStakingDetails = await daiContract.getUserStakings(sId[i]);
        console.log(getStakingDetails, "to get data1 data");
        const data = {
          stakingId: getStakingDetails[0]?.toString(),
          userId: getStakingDetails[1]?.toString(),
          totalTokens: getStakingDetails[2]?.toString(),
          rateOfInterest: getStakingDetails[3]?.toString(),
          withdrawAt: getStakingDetails[4]?.toString(),
          createdAt: getStakingDetails[5]?.toString(),
        };
        console.log(data, "to get data to sho in map");
        setAdded(added + 1);
        arr.push(data);
      }
      setStakingDetails(arr);
      setOpen(false);
    } catch (err) {
      console.log(err, "err");
      setOpen(false);
    }
  }

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getData();
  }, [added]);

  const { write: Withdraw } = useContractWrite({
    mode: "args",
    address: props?.props?.id,
    abi: ContractInterface1,
    functionName: "withdraw",
    overrides: {
      gasLimit: 8000000,
    },
    args: [id],

    onError(error) {
      console.log(error, "error");
      // setShow2(true)
      // return;
    },
    async onSuccess(data) {
      setOpen(true);
      console.log(data, "data");
      var args = [id];
      console.log(args);
      let tx = await data.wait();
      console.log(tx, "tx");
      if (tx.status == 1) {
        setTx(true);
        setOpen(false);
        setShow3(true);
        return;
      }
    },
  });

  async function getId(e) {
    console.log(e, "to get the id to withdraw");
    setId(e);
    Withdraw();
  }

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="staking-mainDiv">
        <div className="staking-secondDiv">
          <label style={{ float: "left" }}>Enter Id Here</label>
          <Spacer y={1} />
          <Input
            bordered
            className="input-text"
            disabled
            // onChange={(e) => setUserId(e.target.value)}
            value={props?.props?.userId}
          />
          <Spacer y={1} />
          <label>Enter Amount Here</label>
          <Spacer y={1} />
          <Input
            bordered
            className="input-text"
            onChange={(e) => setAmount(e.target.value)}
          />
          <Spacer y={1.5} />
          <div className="staking-submitDiv">
            {new Date().toLocaleString() <
              new Date(
                parseFloat(props?.props?.startDate) * 1000
              ).toLocaleString() ||
            new Date().toLocaleString() >
              new Date(
                parseFloat(props?.props?.endDate) * 1000
              ).toLocaleString() ? (
              <Tooltip
                content={
                  (new Date().toLocaleString() <
                    new Date(
                      parseFloat(props?.props?.startDate) * 1000
                    ).toLocaleString() &&
                    "Staking Not Started Yet") ||
                  (new Date().toLocaleString() >
                    new Date(
                      parseFloat(props?.props?.endDate) * 1000
                    ).toLocaleString() &&
                    "Staking Time is Over")
                }
                rounded
                color="error"
              >
                <Button className="connect-wallet2" disabled> 
                  Submit
                </Button>
              </Tooltip>
            ) : (
              <Button className="connect-wallet" onClick={() => Approval()}>
                Submit
              </Button>
            )}
          </div>
        </div>
        <hr className="division" />

        <div className="stakingDetails-Div">
          <label className="withdrawDetails-table">Staking Details</label>
        </div>
        <div className="stakingDetails-mainDiv">
          <Table
            aria-label="Example table with static content"
            css={{
              height: "auto",
              minWidth: "100%",
            }}
          >
            <Table.Header>
              <Table.Column>Sr.No</Table.Column>
              <Table.Column>Staking-Id</Table.Column>
              <Table.Column>User-Id</Table.Column> console.log(props?.props?.id,
              "to get props here");
              <Table.Column>Total Tokens</Table.Column>
              <Table.Column>Rate Of Interest</Table.Column>
              <Table.Column>Withdraw-At</Table.Column>
              <Table.Column>Created-At</Table.Column>
              <Table.Column></Table.Column>
            </Table.Header>
            <Table.Body>
              {stakingDetails?.map((item, id) => {
                return (
                  <Table.Row key={id}>
                    <Table.Cell>{id + 1}</Table.Cell>
                    <Table.Cell>{item?.stakingId}</Table.Cell>
                    <Table.Cell>{item?.userId}</Table.Cell>
                    <Table.Cell>
                      {item?.totalTokens
                        ? Math.floor(
                            ethers.utils.formatEther(item?.totalTokens)
                          )
                        : null}
                    </Table.Cell>
                    <Table.Cell>
                      {item?.rateOfInterest
                        ? Math.floor(
                            ethers.utils.formatEther(item?.rateOfInterest)
                          )
                        : null}
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(item?.withdrawAt * 1000).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(item?.createdAt * 1000).toLocaleString()}
                    </Table.Cell>
                    {/* <Table.Cell>
                      {tx ? (
                        <button className="connect-wallet" disabled>
                          Already Withdraw
                        </button>
                      ) : (
                        <button
                          className="connect-wallet"
                          onClick={(e) => getId(item?.stakingId)}
                        >
                          Withdraw
                        </button>
                      )}
                    </Table.Cell> */}
                    <Table.Cell>
                      <button
                        className="connect-wallet"
                        onClick={(e) => getId(item?.stakingId)}
                      >
                        Withdraw
                      </button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      </div>

      <Modal
        closeButton={false}
        blur
        aria-labelledby="modal-title"
        open={show}
        className="staking-modal"
      >
        <Modal.Body>
          <h3 style={{ textAlign: "center" }}>
            Fail with error:- 'You cannot stake more than max stake of user!'
          </h3>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="connect-wallet"
            auto
            flat
            onPress={() => setShow(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* <Modal
        closeButton={false}
        blur
        aria-labelledby="modal-title"
        open={show1}
        className="staking-modal"
      >
        <Modal.Body>
          <h3 style={{ textAlign: "center" }}>Staking Time is Over</h3>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="connect-wallet"
            auto
            flat
            onPress={() => setShow1(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}

      <Modal
        closeButton={false}
        blur
        aria-labelledby="modal-title"
        open={show2}
        className="staking-modal"
      >
        <Modal.Body>
          <h3 style={{ textAlign: "center" }}>You have already withdraw this stake</h3>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="connect-wallet"
            auto
            flat
            onPress={() => setShow2(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        closeButton={false}
        blur
        aria-labelledby="modal-title"
        open={show3}
        className="staking-modal"
      >
        <Modal.Body>
          <h3 style={{ textAlign: "center" }}>Withdraw Successfull</h3>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="connect-wallet"
            auto
            flat
            onPress={() => router.push("/dashboard")}
          >
            ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Withdraw;
