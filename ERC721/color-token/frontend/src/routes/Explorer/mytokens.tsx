import { Component } from "react";
import { Link, useParams } from "react-router-dom";

import async from "async";
import Web3 from "web3";
import ConnectWalletButton from "../../components/ConnectWalletButton";
import { SpinnerModal, CompleteModal } from "../../components/Modal";
import { ERROR, TRANSACTION_FINISHED } from "../../constants/constants.jsx";
import Color from '../../abis/Color.json'
import { useAppSelector } from "../../hooks/hooks";
import { getNet } from "../../stores/netSlice";
import { connect } from "react-redux";

class MyToken extends Component {
    
  async componentWillMount() {
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {

    console.log(this.props);
    
    // const { net } = this.props;

    // const web3 = new Web3(net.web3context?.library.provider)
    // //Load accounts
    // const accounts = net.account
    // this.setState({ account: net.account })

    // const networkId = await web3.eth.net.getId()
    // const networkData = Color.networks[networkId]
    // if (networkData) {
    //   const abi = Color.abi
    //   const address = networkData.address
    //   const contract = new web3.eth.Contract(abi, address)
    //   this.setState({ contract })
    //   const totalSupply = await contract.methods.totalSupply().call()
    //   this.setState({ totalSupply })
    //   // Load colors
    //   for (let i = 0; i < totalSupply; i++) {
    //     const color = await contract.methods.colors(i).call()
    //     this.setState({
    //       colors: [...this.state.colors, color]
    //     })
    //   }
    //   console.log(this.state.colors)
    // } else {
    //   window.alert("Smart contract not deployed to detected network.");
    // }
  }

  mint = (color) => {
    console.log(color);
    this.state.contract.methods.mint(color).send({from: this.state.account })
    .once("receipt", (receipt) => {
      this.setState({
        colors: [...this.state.colors, color]
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      colors: [],
      spinnerModal: 0,
      completeModal: 0,
      scanUrl: ''
    }
  }

  closeSpinner = (err) => {
    this.setState({
      spinnerModal: 0
    });
  }
  closeComplete = () => {
    this.setState({
      CompleteModal: 0
    });
  }

  renderSpinner = () => {
    return (
        <SpinnerModal closeModal={this.closeSpinner} modalOpen={this.state.spinnerModal} />
    );
  };

  renderComplete = () => {
    return (
        <CompleteModal
            closeModal={this.closeComplete}
            modalOpen={this.state.completeModal}
            scanUrl={this.state.scanUrl}
            page="Transaction"
        />
    );
  };

  mint = (color) => {
    console.log(color);
    this.state.contract.methods.mint(color).send({from: this.state.account })
    .once("receipt", (receipt) => {
      this.setState({
        colors: [...this.state.colors, color]
      })
    })
  }
  
  render() {
    return (
        <>
            {this.state.account.address ? (
                <div
                    id="content-wrapper"
                    className="d-flex flex-column main-margntop home-margintop"
                >
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex text-center">
                        <div className="content mr-auto ml-auto">
                            <h1>Issue Token</h1>
                            <form onSubmit={(event) => {
                            event.preventDefault()
                            const color = this.color.value
                            this.mint(color)
                            }}>
                            <input
                                type="text"
                                className="form-control mb-1"
                                placeholder="e.g. #FFFFFF"
                                ref={(input) => { this.color = input }}
                            />
                            <input
                                type="submit"
                                className="btn btn-block btn-primary"
                                value="MINT"
                            />
                            </form>
                        </div>
                        </main>
                    </div>
                    <hr />
                    <div className="row text-center">
                        {this.state.colors.map((color, key) => {
                            return (
                                <div key={key} className="col-3 mb-3 d-flex align-items-center justify-content-center">
                                    <div className="token mr-4" style={{ backgroundColor: color }}></div>
                                    <div>{color}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <ConnectWalletButton />
            )}
            {this.state.spinnerModal && this.renderSpinner()}
            {this.state.completeModal && this.renderComplete()}
        </>
    );
    }
};

const mapStateToProps = state => ({
    net: getNet(state)
})
export default connect(mapStateToProps)(MyToken);
