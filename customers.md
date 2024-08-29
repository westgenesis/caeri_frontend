/test/v1/customers/create_customer

{
	name: ‘dongfeng’,
	address: ’沙坪坝’,
	phone: ‘1839018310312321392’,
	label_ids: [‘001’, ‘002’],
	comment: ‘asdf’
}


/test/v1/customers/get_customer_list
Payload:
{
	name: ‘dongfeng’ // 模糊过滤 不传就不用过滤
}

返回的list:
[
	{
        customer_id: '001',
		name: ‘dongfeng’,
		address: ’沙坪坝’,
		phone: ‘1839018310312321392’,
		labels: [{
		    label_id: '001'
		    label_name: 123
		    color: ‘#ccc1bb’
		    visual_range: ‘self’
		    creator: ‘user1’
		}, {
		    label_id: '002'
		    label_name: 123
		    color: ‘#ccc1bb’
		    visual_range: ‘self’
		    creator: ‘user1’
		}],
		comment: ‘很捞的客户’
	}
]

/test/v1/customers/delete_customer
Payload:
{
    customer_id: '001'
}


/test/v1/customers/update_customer
{
    customer_id: '001',
	name: ‘dongfeng’,
	address: ’沙坪坝’,
	phone: ‘1839018310312321392’,
	label_ids: [‘001’, ‘002’],
	comment: ‘asdf’
}
