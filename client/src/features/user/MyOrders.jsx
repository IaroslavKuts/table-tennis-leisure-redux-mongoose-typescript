import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Sort,
  ContextMenu,
  Filter,
  Page,
  ExcelExport,
  PdfExport,
  Edit,
  Inject,
  Toolbar,
  Search,
} from "@syncfusion/ej2-react-grids";
import { contextMenuItems, ordersGrid } from "../../data/dummy";
import { Header } from "../../common/components";
import OrderTimeChoice from "./OrderTimeChoice";

import { useDeleteOrderMutation } from "./ordersSlice";
import { useSelector } from "react-redux";
import { selectUser } from "./userSlice";

//Component that gives to an user an option to browse its orders
//User can also change/delete any of its orders
const MyOrders = () => {
  console.log("MyOrders rendered");
  const user = useSelector(selectUser)[0];
  const [deleteOrder] = useDeleteOrderMutation();

  const editorTemplate = (args) => {
    // Calling any setState causes trouble, but still renders);
    return <OrderTimeChoice dateOfGame={args.date_of_game} />;
  };
  const actionBegin = async (args) => {
    // async ???
    console.log("actionBegin", args);
    try {
      if (
        args.requestType === "beginEdit" &&
        new Date(args.rowData.date_of_game) < new Date()
      ) {
        console.log("cancel-true");
        args.cancel = true;
      }
      if (args.requestType === "delete") {
        if (new Date(args.data[0].date_of_game) > new Date()) {
          // await deleteOrder({
          //   order_id: args.data[0]._id,
          //   _id: user._id,
          // }).unwrap();
        } else {
          args.cancel = true;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const editing = {
    allowDeleting: true,
    allowEditing: true,
    mode: "Dialog",
    template: editorTemplate,
    headerTemplate: " ",
    footerTemplate: " ",
  };

  const toolbarOptions = ["Edit", "Delete", "Search"];
  return (
    <div className="flex flex-col items-center m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header title="My Orders" />
      {
        <GridComponent
          id="gridcomp"
          dataSource={[...user.orders]}
          allowPaging
          allowSorting
          allowExcelExport
          allowPdfExport
          contextMenuItems={contextMenuItems}
          editSettings={editing}
          toolbar={toolbarOptions}
          actionBegin={actionBegin}
          // actionComplete={actionComplete}
        >
          <ColumnsDirective>
            {ordersGrid.map((item, index) => (
              <ColumnDirective key={index} {...item} />
            ))}
          </ColumnsDirective>
          <Inject
            services={[
              Resize,
              Sort,
              ContextMenu,
              Filter,
              Page,
              ExcelExport,
              Edit,
              PdfExport,
              Toolbar,
              Search,
            ]}
          />
        </GridComponent>
      }
    </div>
  );
};

export default MyOrders;
