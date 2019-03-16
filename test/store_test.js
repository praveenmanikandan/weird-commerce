const store=artifacts.require("Store");

contract("Store",async (accounts)=>{
  it("create store",async ()=>{
    let instance=await store.deployed();
    let manager=await instance.manager.call();
    assert.equal(accounts[0],manager,"manager != store owner");
  });

  it("add product",async()=>{
    let name="test product";
    let price=1;
    let description="test description";
    let instance=await store.deployed();
    await instance.addProduct(name,price,description,{from:accounts[0]});

    let product=await instance.Products.call(0);
    assert.equal(name,product.name,price,product.price,description,product.description,"cannot add product");
  });

  it("only manager can add product",async()=>{
    let instance=await store.deployed();
    try{
    await instance.addProduct("name",1,"description",{from:accounts[1]});
    }
    catch(error){
      return true;
    }
  });

  it("place order",async()=>{
    let instance=await store.deployed();
    let index=0;
    let quantity=1;
    await instance.addProduct("name",1,"description",{from:accounts[0]});
    await instance.placeOrder(index,quantity,{from:accounts[1]});
    let order=await instance.Orders.call(0);
    assert.equal(index,order.index,quantity,order.quantity,"doesn't place order");
  });

  it("take order",async()=>{
    let instance=await store.deployed();
    let index=0;
    let quantity=1;
    await instance.addProduct("name",1,"description",{from:accounts[0]});
    await instance.placeOrder(index,quantity,{from:accounts[1]});
    let order=await instance.Orders.call(0);
    await instance.takeOrder(0,{from:accounts[0]});
    order=await instance.Orders.call(0);
    assert.equal(1,order.status);
  });

  it("reject order",async()=>{
    let instance=await store.deployed();
    let index=0;
    let quantity=1;
    await instance.addProduct("name",1,"description",{from:accounts[0]});
    await instance.placeOrder(index,quantity,{from:accounts[1]});
    let order=await instance.Orders.call(0);
    await instance.rejectOrder(0,{from:accounts[0]});
    order=await instance.Orders.call(0);
    assert.equal(2,order.status);
  });

  it("take delivery",async()=>{
    let instance=await store.deployed();
    let index=0;
    let quantity=1;
    await instance.addProduct("name",1,"description",{from:accounts[0]});
    await instance.placeOrder(index,quantity,{from:accounts[1]});
    await instance.takeOrder(0,{from:accounts[0]});
    await instance.takeDelivery(0,{from:accounts[2],value:1});
    let order=await instance.Orders.call(0);
    assert.equal(order.delivery,accounts[2]);
  });

  it("pay to delivery",async()=>{
    let instance=await store.deployed();
    let index=0;
    let quantity=1;
    await instance.addProduct("name",1,"description",{from:accounts[0]});
    await instance.placeOrder(index,quantity,{from:accounts[1]});
    await instance.takeOrder(0,{from:accounts[0]});
    await instance.takeDelivery(0,{from:accounts[2],value:1});
    await instance.payToDelivery(0,{from:accounts[1],value:21});
    let order=await instance.Orders.call(0);
     assert.equal(3,order.status);
  });



});
