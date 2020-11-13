module.exports = {
    "up": `
    CREATE TABLE ${'`documents`'} (
        ${'`id`'} BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        ${'`nro_tramite`'} VARCHAR(32) NOT NULL,
        ${'`tipo`'} VARCHAR(16) NOT NULL,
        ${'`destino`'} VARCHAR(16) NOT NULL,
        ${'`folios`'} TINYINT(128) UNSIGNED NOT NULL DEFAULT '0',        
        ${'`asunto`'} VARCHAR(32) NULL DEFAULT NULL,
        ${'`administrado`'} VARCHAR(50) NOT NULL,
        ${'`registro`'} DATETIME DEFAULT CURRENT_TIMESTAMP,
        ${'`dig`'} VARCHAR(10) DEFAULT ' ',
        ${'`estado`'} VARCHAR(32), 
        PRIMARY KEY (${'`id`'})
    )
    COLLATE='latin1_swedish_ci'
    ;
    `,

    "down": `
    DROP TABLE ${'`documents`'}
    `,
}