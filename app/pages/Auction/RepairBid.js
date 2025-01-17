import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {consensus} from 'hsd/lib/protocol';
import walletClient from '../../utils/walletClient';
import * as names from '../../ducks/names';
import { showError } from '../../ducks/notifications';
import {I18nContext} from "../../utils/i18n";

export class RepairBid extends Component {
  static propTypes = {
    bid: PropTypes.object.isRequired,
    getNameInfo: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
  };

  static contextType = I18nContext;

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      value: "",
      isCorrect: false,
    };
  };

  renderRepairableBid() {
    const {t} = this.context;
    return (
      <div
        className="bid-history__repair-bid"
        onClick={() => this.setState({isEditing: true})}
      >
        {`⚠️ ${t('unknownBid')}`}
      </div>
    );
  }

  renderInput() {
    return (
      <input
        className={this.state.isCorrect ? 'bid-history__correct' : ''}
        placeholder="0.00"
        value={this.state.value}
        onChange={(e) => {
            this.processValue(e.target.value);
          }
        }
        disabled={this.state.isCorrect}
      />
    );
  }

  processValue = async (val) => {
    const value = val.match(/[0-9]*\.?[0-9]{0,6}/g)[0];
    this.setState({value: value});
    const parsed = parseFloat(value);

    if (val === "" || Number.isNaN(parsed) || parsed * consensus.COIN > consensus.MAX_MONEY)
      return;

    return this.verifyBid(parsed);
  };

  async verifyBid(value) {
    const {bid} = this.props;
    try {
      const attempt = await walletClient.getNonce({
        name: bid.name,
        address: bid.from,
        bid: value * consensus.COIN
      });

      if (attempt.blind === bid.blind) {
        this.setState({isCorrect: true});

        await walletClient.importNonce({
          name: bid.name,
          address: bid.from,
          bid: value,
        });

        this.props.getNameInfo(bid.name);
      }
    } catch (e) {
      this.props.showError(e.message);
    }
  }

  render() {
    return this.state.isEditing
    ? this.renderInput()
    : this.renderRepairableBid();
  }
}

export default connect(
  () => ({}),
  dispatch => ({
    getNameInfo: tld => dispatch(names.getNameInfo(tld)),
    showError: (message) => dispatch(showError(message)),
  }),
)(RepairBid);
