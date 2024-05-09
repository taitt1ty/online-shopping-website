export  const COLUMNS_TYPE_SHIP = [
    {
      title: 'ID',
      width: 50,
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
    },
    {
      title: 'Loại vận chuyển',
      width: 150,
      dataIndex: 'type',
      key: 'type',
      fixed: 'left',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      width: 150,
    },
    {
      title: 'Action',
      key: 'actions',
      fixed: 'right',
      width: 100,
      onClick_Edit: () => {
        console.log("Hello from edit");
      },
      onClick_Delete: () => {
        console.log("Hello from delete");
      }
    }
  ];