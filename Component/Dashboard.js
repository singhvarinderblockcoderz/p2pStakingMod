import React, { useEffect, useState, useRef } from "react";
import { useContractWrite, useContractEvent } from "wagmi";
import { parseEther } from "viem";
import ContractInterface from "../token-abi1.json";
import { Modal, Button, Table } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
console.log(ContractInterface, "abi");
import DatePicker from "rsuite/DatePicker";

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const [duration, setDuration] = useState("");
  const [roi, setRoi] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [total, setTotal] = useState("");
  const [totalStaking, setTotalStaking] = useState();
  const [totalData, setTotalData] = useState();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dataFetchedRef = useRef(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startLeft, setStartLeft] = useState();
  const [endLeft, setEndLeft] = useState();

  const { write: write } = useContractWrite({
    mode: "args",
    address: "0xB3a2Fa63b84511C8d6c566830c0757E62d6B4ED5",
    abi: ContractInterface,
    functionName: "startNewStaking",
    overrides: {
      gasLimit: 8000000,
    },
    args: [
      duration,
      roi,
      parseEther(`${min}`),
      parseEther(`${max}`),
      parseEther(`${total}`),
      new Date(startDate)?.getTime() / 1000,
      new Date(endDate)?.getTime() / 1000,
    ],
    onError(error) {
      console.log(error, "error");
      setOpen(false);
    },
    async onSuccess(data) {
      setOpen(true);
      setShow(false);
      console.log(data, "data");
      let tx = await data.wait();
      console.log(tx, "tx");
      window.location.href = "/dashboard";
    },
  });

  async function getData() {
    try {
      let res = await axios.post("/api/getData");
      const response = res.data;
      console.log(response, "to get response from api");
      setTotalData(response?.data?.data?.data);
      console.log(
        new Date(parseFloat(response.data.data.data[0].endDate) * 1000)
          .toISOString()
          ?.slice(0, -4),
        "endLeft"
      );
      setStartLeft(
        new Date(parseFloat(response.data.data.data[0].startDate) * 1000)
          .toISOString()
          ?.slice(0, -5)
      );
      setEndLeft(
        new Date(parseFloat(response.data.data.data[0].endDate) * 1000)
          .toISOString()
          ?.slice(0, -5)
      );
      setTotalStaking((response?.data?.data?.data).length);
    } catch (err) {
      console.log(err, "err");
    }
  }
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getData();
  }, []);

  console.log(new Date(startDate)?.getTime() / 1000, "startTme");

  // const getTimeDifference = () => {
  //   console.log(startLeft,endLeft,"getleft")
  //   console.log(Date.parse(startLeft),"parseStart")
  //   const difference = Date.parse(endLeft)- Date.parse(startLeft);
  //   console.log((new Date(difference)?.getTime()),"diff")
  //   const timeLeft = {};

  //   if (difference > 0) {
  //     timeLeft.days = Math.floor(difference / (1000 * 60 * 60 * 24));
  //     timeLeft.hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  //     timeLeft.minutes = Math.floor((difference / 1000 / 60) % 60);
  //     timeLeft.seconds = Math.floor((difference / 1000) % 60);
  //   } else {
  //     // Timer expired
  //     timeLeft.days = 0;
  //     timeLeft.hours = 0;
  //     timeLeft.minutes = 0;
  //     timeLeft.seconds = 0;
  //   }

  //   return timeLeft;
  // };

  // const [timeLeft, setTimeLeft] = useState(getTimeDifference());

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimeLeft(getTimeDifference());
  //   }, 1000);

  //   // Clear the interval when the component is unmounted
  //   return () => clearInterval(interval);
  // }, [startLeft, endLeft]);

  return (
    <>
      {/* <div>
      {timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.minutes} minutes, {timeLeft.seconds} seconds left
    </div> */}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div>
        <div className="createStaking-Button">
          <button onClick={() => setShow(true)} className="connect-wallet">
            Create Staking
          </button>
        </div>
        <h1 className="heading-totalStaking">TotalStaking:-{totalStaking}</h1>
        <div className="dashboardDetails-mainDiv">
          <Table
            aria-label="Example table with static content"
            css={{
              height: "auto",
              minWidth: "100%",
            }}
          >
            <Table.Header>
              <Table.Column>Sr.No</Table.Column>
              <Table.Column>Duration</Table.Column>
              <Table.Column>Rate of Interest</Table.Column>
              <Table.Column>Min User Token Stake</Table.Column>
              <Table.Column>Max User Token Stake</Table.Column>
              <Table.Column>Total Tokens</Table.Column>
              <Table.Column>Address</Table.Column>
              <Table.Column>Start Date</Table.Column>
              <Table.Column>End Date</Table.Column>
              <Table.Column></Table.Column>
            </Table.Header>
            <Table.Body>
              {totalData?.map((item, id) => {
                return (
                  <Table.Row key={id}>
                    <Table.Cell>{id + 1}</Table.Cell>
                    <Table.Cell>{item?.duration}</Table.Cell>
                    <Table.Cell>{Math.floor(item?.rateOfInterest)}</Table.Cell>
                    <Table.Cell>
                      {Math.floor(item?.minUserTokenStake)}
                    </Table.Cell>
                    <Table.Cell>
                      {Math.floor(item?.maxUserTokenStake)}
                    </Table.Cell>
                    <Table.Cell>
                      {Math.floor(item?.totalTokensForStake)}
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        href={`https://mumbai.polygonscan.com/address/${item?.contractAddress}`}
                        target="_blank"
                      >
                        {item?.contractAddress}
                      </Link>
                    </Table.Cell>

                    <Table.Cell>
                      {new Date(
                        parseFloat(item?.startDate) * 1000
                      ).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(
                        parseFloat(item?.endDate) * 1000
                      ).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell>
                      <button
                        className="connect-wallet"
                        onClick={() =>
                          router.push(
                            `/staking/${item?.contractAddress}?userId=${item?.id}&&startDate=${item?.startDate}&&endDate=${item?.endDate}`
                          )
                        }
                      >
                        Details
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
          <label htmlFor="duration">Duration</label>
          <input
            type="number"
            placeholder="duration"
            // onWheel={handleOnWheel}
            onChange={(e) => setDuration(e.target.value)}
            onFocus={(e) =>
              e.target.addEventListener(
                "wheel",
                function (e) {
                  e.preventDefault();
                },
                { passive: false }
              )
            }
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
          />
          <br />
          <label htmlFor="roi">Rate Of Interest</label>
          <input
            type="number"
            placeholder="rateOfInterest"
            onChange={(e) => setRoi(e.target.value)}
            onFocus={(e) =>
              e.target.addEventListener(
                "wheel",
                function (e) {
                  e.preventDefault();
                },
                { passive: false }
              )
            }
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
          />
          <br />
         
          <label htmlFor="startDate">Start Date<span className="span"><button className="connect-wallet1">Submit</button></span></label>
          <input
            type="datetime-local"
            class="transaction-date"
            onChange={(e) => setStartDate(e.target.value)}
          />
          <br />
          <label htmlFor="endDate">End Date<span className="span"><button className="connect-wallet1">Submit</button></span></label>
          <input
            type="datetime-local"
            class="transaction-date"
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
          />
          <br />
          <label htmlFor="minUser">Min User</label>
          <input
            type="number"
            placeholder="minUser"
            onChange={(e) => setMin(e.target.value)}
            onFocus={(e) =>
              e.target.addEventListener(
                "wheel",
                function (e) {
                  e.preventDefault();
                },
                { passive: false }
              )
            }
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
          />{" "}
          <br />
          <label htmlFor="maxUser">Max User</label>
          <input
            type="number"
            placeholder="maxUser"
            onChange={(e) => setMax(e.target.value)}
            onFocus={(e) =>
              e.target.addEventListener(
                "wheel",
                function (e) {
                  e.preventDefault();
                },
                { passive: false }
              )
            }
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
          />
          <br />
          <label htmlFor="total">Total Tokens</label>
          <input
            type="number"
            placeholder="totalTokens"
            onChange={(e) => setTotal(e.target.value)}
            onFocus={(e) =>
              e.target.addEventListener(
                "wheel",
                function (e) {
                  e.preventDefault();
                },
                { passive: false }
              )
            }
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
          />
          <br />
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
          <Button className="connect-wallet" auto onPress={() => write()}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Dashboard;
