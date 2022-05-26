/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 *
 * FinancialDashboard
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { compose } from 'redux';
import SideNav from 'components/SideNav';
import Input from 'components/Input';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Button from 'components/Button';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import * as FinancialDashboardSelectors from 'data/selectors/financialDashboardSelectors';
import * as FinancialDashboardActions from 'redux/actions/FinancialDashboardActions';
import { dateStrFromIsoString } from 'utils/dates';
import GetAppIcon from '@material-ui/icons/GetApp';
import FilterSidebar from './FilterSidebar';

const FETCH_DASHBOARD_DATA = `{
  viewer {
    events {
      totalRevenue
      grossRevenue
      startDate
      title
      id
    }
  }
}`;

const TableWrapper = styled(TableContainer)`
  margin-bottom: 12px;
  min-height: 300px;
  max-height: 400px;
  overflow-y: auto;
  max-width: 600px;
`;

const RevenueTable = styled.div`
  border: 1px gray solid;
  border-radius: 8px;
  min-height: 300px;
  max-height: 400px;
  min-width: 350px;
`;

const LimitedHeightTable = styled(Table)`
  max-height: 300px;
`;

class FinancialDashboard extends React.Component {
  static propTypes = {
    fetchTicketRevenue: PropTypes.func.isRequired,
    ticketRevenue: PropTypes.array.isRequired,
    ticketRevenueByTicketGroup: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.hiddenDownloaderRef = React.createRef();
    this.state = {
      expenses: [],
    };
  }

  handleAddExpenseForm = newExpense => {
    const { expenses } = this.state;
    this.setState({
      expenses: [...expenses, newExpense],
    });
  };

  handleOnUpdateForm = evnt => {
    const {
      target: { value },
      name,
    } = evnt;

    if (name === 'amount') {
      this.setState({ [name]: parseInt(value) });
    }
  };

  onApplyFilters = formState => {
    const { fetchTicketRevenue } = this.props;
    const { customDateStart, customDateEnd, eventStatus } = formState;
    // for events that have None for their status
    eventStatus.push(null);
    fetchTicketRevenue({
      ...formState,
      dateStart: dateStrFromIsoString(customDateStart.toISOString()),
      dateEnd: dateStrFromIsoString(customDateEnd.toISOString()),
      eventStatus,
      dateTimeStart: customDateStart.toISOString(),
      dateTimeEnd: customDateEnd.toISOString(),
    });
  };

  renderEnterExpenseRow = () => (
    <div onSubmit={this.handleAddExpenseForm} className="d-flex my-2">
      <div className="mx-2">
        <Input name="expenseName" placeholder="Expense Name" />
      </div>
      <div className="mx-2">
        <Input
          name="amount"
          type="number"
          placeholder="Expense Amount (as percentage or amount)"
        />
        <Button> Add </Button>
      </div>
    </div>
  );

  renderExpenseIcon = event => {};

  downloadEventRevenueCSV = () => {
    const { ticketRevenue } = this.props;
    let csv = 'Name,Gross Revenue\n';
    ticketRevenue.forEach(row => {
      csv += `${row.title},${row.grossRevenue}`;
      csv += `\n`;
    });
    return `data:text/csv;charset=utf-8,${encodeURI(csv)}`;
  };

  downloadEventRevenueByTicketGroupCSV = () => {
    const { ticketRevenueByTicketGroup } = this.props;
    let csv = 'Ticket Group,Revenue\n';
    ticketRevenueByTicketGroup.forEach(row => {
      csv += `${row.label},${row.value}`;
      csv += `\n`;
    });
    return `data:text/csv;charset=utf-8,${encodeURI(csv)}`;
  };

  render() {
    const {
      ticketRevenue,
      ticketRevenueByTicketGroup,
      ticketRevenueByTotal,
    } = this.props;
    let revenueTotal = 0;

    return (
      <div className="full-height full-width d-flex flex-justify-between">
        <Helmet>
          <title>Cadenzo | Financial Dashboard</title>
        </Helmet>
        <div className="d-flex">
          <SideNav />
          <div className="d-flex flex-wrap mt-3">
            <div className="d-flex flex-column">
              <div className="d-flex flex-justify-center flex-items-center">
                <p className="work-sans-black h5 mt-2 text-center mr-3">
                  Ticket Revenue By Event
                </p>
                <a
                  className="flex-self-end"
                  href={this.downloadEventRevenueCSV()}
                  download="event_revenue.csv"
                >
                  <div className="d-flex flex-justify-center flex-items-center">
                    <h4 className="h4 color-primary">Export</h4>
                    <GetAppIcon color="primary" />
                  </div>
                </a>
              </div>
              <RevenueTable className="d-flex flex-column mx-3 mb-2 mt-1">
                <TableWrapper>
                  <LimitedHeightTable size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell> Name </TableCell>
                        <TableCell align="right">Total Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ticketRevenue.map(row => {
                        revenueTotal += row.grossRevenue;
                        return (
                          <TableRow key={row.title}>
                            <TableCell component="th" scope="row">
                              {row.title}
                            </TableCell>
                            <TableCell align="right">
                              ${row.grossRevenue.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell> Total </TableCell>
                        <TableCell align="right">
                          {' '}
                          ${revenueTotal.toFixed(2)}{' '}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </LimitedHeightTable>
                </TableWrapper>
              </RevenueTable>
            </div>
            <div className="d-flex flex-column">
              <div className="d-flex flex-justify-center flex-items-center">
                <p className="work-sans-black h5 mt-2 text-center mr-3">
                  Ticket Revenue By Ticket Group
                </p>
                <a
                  className="flex-self-end"
                  href={this.downloadEventRevenueByTicketGroupCSV()}
                  download="event_revenue_by_ticket_group.csv"
                >
                  <div className="d-flex flex-justify-center flex-items-center">
                    <h4 className="h4 color-primary">Export</h4>
                    <GetAppIcon color="primary" />
                  </div>
                </a>
              </div>
              <RevenueTable className="d-flex flex-column mx-3 mb-2 mt-1">
                <TableWrapper>
                  <LimitedHeightTable size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell> Name </TableCell>
                        <TableCell align="right">Total Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ticketRevenueByTicketGroup.map(row => (
                        <TableRow key={row.label}>
                          <TableCell component="th" scope="row">
                            {row.label}
                          </TableCell>
                          <TableCell align="right">
                            ${row.value.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell> Total </TableCell>
                        <TableCell align="right">
                          {' '}
                          ${ticketRevenueByTotal.toFixed(2)}{' '}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </LimitedHeightTable>
                </TableWrapper>
              </RevenueTable>
            </div>
          </div>
        </div>
        <div className="d-flex mt-3">
          <FilterSidebar onFilterChange={this.onApplyFilters} />
        </div>
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  ticketRevenue: FinancialDashboardSelectors.getTicketRevenue(),
  ticketRevenueByTicketGroup: FinancialDashboardSelectors.getTicketRevenueByGroup(),
  ticketRevenueByTotal: FinancialDashboardSelectors.getTicketGroupRevenueAggAmount(),
});

const mapDispatchToProps = {
  fetchTicketRevenue: FinancialDashboardActions.fetchTicketRevenue,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(FinancialDashboard);
