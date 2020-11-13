module.exports = {
    "up": `
        CREATE TABLE ${'`perfil`'} (
            ${'`id`'} BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            ${'`name`'} VARCHAR(255) NOT NULL,
            ${'`codigo`'} VARCHAR(50) NOT NULL,            
            PRIMARY KEY (${'`id`'})
        )
        COLLATE='latin1_swedish_ci'
        ;    
    `,
    "down": `DROP TABLE ${'`perfil`'}`,

}