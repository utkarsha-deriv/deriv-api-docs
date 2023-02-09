import { TTokenColumn, TTokensArrayType } from '@site/src/contexts/tokenPage/types';
import { render, screen, cleanup, within } from '@site/src/test-utils';
import userEvent from '@testing-library/user-event';
import React from 'react';
import useDeleteToken from '../../../hooks/useDeleteToken';
import ApiLastUsedCell from '../Cells/table.lastused.cell';
import ApiScopesCell from '../Cells/table.scopes.cell';
import ApiTokenCell from '../Cells/table.token.cell';
import Table from '../Table';

jest.mock('../../../hooks/useDeleteToken');

const mockUseDeleteToken = useDeleteToken as jest.MockedFunction<
  () => Partial<ReturnType<typeof useDeleteToken>>
>;

const mockDeleteToken = jest.fn();

mockUseDeleteToken.mockImplementation(() => ({
  deleteToken: mockDeleteToken,
}));

const tableColumns: TTokenColumn[] = [
  {
    Header: 'Name',
    accessor: 'display_name',
  },
  {
    Header: 'Token',
    accessor: 'token',
    Cell: ApiTokenCell,
  },
  {
    Header: 'Scopes',
    accessor: 'scopes',
    Cell: ApiScopesCell,
  },
  {
    Header: 'Last Used',
    accessor: 'last_used',
    Cell: ApiLastUsedCell,
  },
  {
    Header: 'Valid for IP',
    accessor: 'valid_for_ip',
  },
];

const tokens: TTokensArrayType = [
  {
    display_name: '111111',
    last_used: '2022-02-04 10:33:51',
    scopes: ['read', 'trade'],
    token: 'token_1',
    valid_for_ip: '',
  },
  {
    display_name: 'michio_app_pages',
    last_used: '2022-10-04 10:33:51',
    scopes: ['read', 'trade', 'payments', 'trading_information', 'admin'],
    token: 'token_2',
    valid_for_ip: '',
  },
];

describe('Table', () => {
  beforeEach(() => {
    render(
      <Table
        columns={tableColumns}
        data={tokens}
        initialState={{ hiddenColumns: ['valid_for_ip'] }}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('Should render token cells properly', () => {
    const tokenCells = screen.getAllByTestId('token-cell');

    expect(tokenCells.length).toBe(2);

    const tokenCellsTextContent = tokenCells.map((item) => item.textContent);
    expect(tokenCellsTextContent).toEqual(expect.arrayContaining(['token_1', 'token_2']));
  });

  it('Should render scope cells properly', () => {
    const scopeCells = screen.getAllByTestId('token-cell');
    expect(scopeCells.length).toBe(2);
  });

  it('Should render last used cells properly', () => {
    const lastusedCells = screen.getAllByTestId('lastused-cell');

    expect(lastusedCells.length).toBe(2);

    const lastusedCellsContent = lastusedCells.map((item) => item.firstChild.textContent);

    expect(lastusedCellsContent).toEqual(['2022-02-04', '2022-10-04']);
  });

  it('Should delete token on delete button clicked', async () => {
    const lastusedCells = screen.getAllByTestId('lastused-cell');
    const firstCell = lastusedCells[0];
    const withinFirstCell = within(firstCell);
    const deleteButton = withinFirstCell.getByRole('button');

    await userEvent.click(deleteButton);

    expect(mockDeleteToken).toHaveBeenCalledTimes(1);
    expect(mockDeleteToken).toHaveBeenCalledWith('token_1');
  });
});
