pragma solidity ^0.5.0;

//store contract for shops
contract Store{
    //structs
    struct Product{
        string name;
        uint price;
        string description;
    }
    struct Order{
        address customer;
        address payable delivery;
        uint index;
        uint quantity;
        uint price;
        uint status;
        uint deliveryCharge;
    }

    //variables
    address payable public  manager;
    Product[] public Products;
    Order[] public Orders;

    //modifiers
    modifier restricted{
        require(msg.sender==manager);
        _;
    }

    //functions
    constructor() public {
        manager=msg.sender;
    }

    function addProduct(string memory _name,uint _price,string memory _description) public restricted {
        Product memory newProduct=Product({
            name:_name,
            price:_price,
            description:_description
        });
        Products.push(newProduct);
    }

    function placeOrder(uint _index,uint _quantity) external {
    Order memory newOrder=Order({
        customer:msg.sender,
        delivery:manager,
        index:_index,
        quantity:_quantity,
        price:_quantity*Products[_index].price,
        status:0,
        deliveryCharge:20
    });
    Orders.push(newOrder);

    }

    function takeOrder(uint _orderIndex) public restricted{
        Orders[_orderIndex].status=1;
    }

    function rejectOrder(uint _orderIndex) public restricted{
        Orders[_orderIndex].status=2;
    }

    function takeDelivery(uint _orderIndex) public payable{
        require(Orders[_orderIndex].status==1);
        require(msg.value>=Orders[_orderIndex].price);
        manager.transfer(msg.value);
        Orders[_orderIndex].delivery=msg.sender;
    }

    function payToDelivery(uint _orderIndex) public payable{
        Order memory _currentOrder=Orders[_orderIndex];
        require(msg.sender==_currentOrder.customer);
        require(msg.value==_currentOrder.price+_currentOrder.deliveryCharge);
        _currentOrder.delivery.transfer(msg.value);
        Orders[_orderIndex].status=3;

    }


}
