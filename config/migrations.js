const permissions = [
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

    'create role',
    'view any role',
    'view role',
    'update role',
    'remove role',

    'view any slot',
    'view slot',
    'update slot',
]

const roles = {
    admin: [...permissions],
    user: [
        'create user',
        'view slot',
        'view user',
        'update user',
    ],
    manager: [
        'create company user',
        'view company user',
        'update company user',
        'remove company user',
    ],
    parking_officer: [
        'view any slot',
        'view slot',
        'update slot',
    ]
}

const users = [
    {
        username: 'admin',
        email: 'super@admin.com',
        password: 'superuser',
        roles: ['admin']
    },
    {
        username: 'manager',
        email: 'main@manager.com',
        password: 'superuser',
        roles: ['manager']
    }
]

module.exports = { permissions, roles, users }
