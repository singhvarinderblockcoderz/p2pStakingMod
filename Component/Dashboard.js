import React, { useEffect, useState, useRef } from "react";
import { useContractWrite, useContractEvent } from "wagmi";
import { parseEther } from "viem";
import ContractInterface from "../token-abi1.json"
import { Modal, Button, Table } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
console.log(ContractInterface,"abi")
import DatePicker from 'rsuite/DatePicker';

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
  const [endDate, setEndDate] = useState("")


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
      (new Date(startDate)?.getTime()/1000),
      (new Date(endDate)?.getTime()/1000),
    ],
    onError(error) {
      console.log(error, "error");
      setOpen(false)
    },
    async onSuccess(data) {
      setOpen(true);
      setShow(false)
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
      setTotalStaking((response?.data?.data?.data).length)
    } catch (err) {
      console.log(err, "err");
    }
  }
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getData();
  }, []);


  console.log((new Date(startDate)?.getTime()/1000), "startTme")
  return (
    <>
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
                    <Table.Cell>{Math.floor(item?.minUserTokenStake)}</Table.Cell>
                    <Table.Cell>{Math.floor(item?.maxUserTokenStake)}</Table.Cell>
                    <Table.Cell>{Math.floor(item?.totalTokensForStake)}</Table.Cell>
                    <Table.Cell>
                      <Link
                        href={`https://mumbai.polygonscan.com/address/${item?.contractAddress}`}
                        target="_blank"
                        >
                        {item?.contractAddress}
                      </Link>
                    </Table.Cell>
                    
                        <Table.Cell>{new Date(parseFloat(item?.startDate)*1000).toLocaleString()}</Table.Cell>
                        <Table.Cell>{new Date(parseFloat(item?.endDate)*1000).toLocaleString()}</Table.Cell>
                    <Table.Cell>
                      <button
                        className="connect-wallet"
                        onClick={() => router.push(`/staking/${item?.contractAddress}?userId=${item?.id}`)}
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
            type="text"
            placeholder="duration"
            onChange={(e) => setDuration(e.target.value)}
          />
          <br />
          <label htmlFor="roi">Rate Of Interest</label>
          <input
            type="text"
            placeholder="rateOfInterest"
            onChange={(e) => setRoi(e.target.value)}
          />
          <br />
          <label htmlFor="startDate">Start Date</label>
          <input
            type="datetime-local"
            class="transaction-date"
            onChange={(e) => setStartDate(e.target.value)}
          />
          <br />
          <label htmlFor="endDate"></label>
          <input
            type="datetime-local"
            class="transaction-date"
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
          />
          <br/>
          <label htmlFor="minUser">Min User</label>
          <input
            type="text"
            placeholder="minUser"
            onChange={(e) => setMin(e.target.value)}
          />{" "}
          <br />
          <label htmlFor="maxUser">Max User</label>
          <input
            type="text"
            placeholder="maxUser"
            onChange={(e) => setMax(e.target.value)}
          />
          <br />
          <label htmlFor="total">Total Tokens</label>
          <input
            type="text"
            placeholder="totalTokens"
            onChange={(e) => setTotal(e.target.value)}
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

