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
]

const roles = {
    admin: [...permissions],
    user: [
        'create user',
        'view user',
        'update user',
        
        'view slot',
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
    ],
    parking_officer: [
        'view any slot',
        'view slot',
        'update slot',

        'create officer',
        'view officer',
        'update officer',
        'remove officer',
    ]
}

const users = [
    {
        username: 'admin',
        email: 'super@admin.com',
        password: 'superuser',
        roles: ['admin']
    }
]

module.exports = { permissions, roles, users }
