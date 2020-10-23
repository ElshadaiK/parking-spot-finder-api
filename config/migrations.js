const permissions = [
    
    'create role',
    'view any role',
    'view role',
    'update role',
    'remove role',

    'create user',
    'view any user',
    'view user',
    'update user',
    'remove user',

    'create company',
    'view company',
    'view any company',
    'update company',
    'remove company',

    'create officer',
    'view any officer',
    'view officer',
    'update officer',
    'remove officer',

    'create slot',
    'view any slot',
    'view slot',
    'update slot',

    'park car',
    'unpark car',

    'get ticket',
    'give ticket'
]

const roles = {
    admin: [...permissions],
    user: [
        'create user',
        'view user',
        'update user',
        
        'view slot',
        'view any slot',
        
        'park car',
        'unpark car',
        'get ticket'
    ],
    company: [
        'create company user',
        'view company user',
        'update company user',
        'remove company user',

        'create slot',
        'view any slot',
        'view slot',
        'update slot',

        'create officer',
        'view any officer',
        'view officer',
        'update officer',
        'remove officer',

        'view company'
    ],
    parking_officer: [
        'view any slot',
        'view slot',
        'update slot',

        'view officer',
        'update officer',

        'give ticket'
    ]
}

const users = [
    {
        name: 'admin',
        email: 'super@admin.com',
        password: 'superuser',
        roles: ['admin'],
        plate_number : 00000,
        phone_no : +251900000000

    }
]

module.exports = { permissions, roles, users }
