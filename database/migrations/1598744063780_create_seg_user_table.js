module.exports = {
    "up": `
    CREATE TABLE ${'`SEG_USER`'} (
        ${'`USER_IN_CODIGO`'} int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
        ${'`USER_VC_NOMBRE`'} varchar(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`USER_VC_PASSWORD`'} varchar(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`AUDI_DA_MODI`'} date NULL DEFAULT NULL,
        ${'`USER_FG_BAJA`'} char(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`USER_VC_LOGIN`'} varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`CPM_VC_TIPOPERSONAL`'} varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`CPM_VC_REGLABORAL`'} varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`CPM_VC_REGPENSION`'} varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`CARG_IN_CODIGO`'} int(11) UNSIGNED NULL DEFAULT NULL,
        ${'`CPM_VC_CONDILABORAL`'} varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`USER_VC_CODINTERNO`'} varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`USER_VC_PATERNO`'} varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`USER_VC_MATERNO`'} varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`USER_DA_NACIMIENTO`'} date NULL DEFAULT NULL,
        ${'`USER_VC_TELEFONO`'} varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`USER_VC_CORREO`'} varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`USER_VC_NRODOC`'} varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`USER_VC_OBSERVACIONES`'} text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
        ${'`CPM_VC_TIPODOC`'} varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`USER_VC_FAX`'} varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`USER_VC_WEB`'} varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`PERF_IN_CODIGO`'} int(11) UNSIGNED NULL DEFAULT NULL,
        ${'`USER_VC_CODMIGRACION`'} varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`USER_FG_ENVIOCORREO1`'} char(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`USER_VC_FLEX01`'} varchar(150) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`USER_VC_FLEX02`'} varchar(150) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`AUDI_VC_USERCREA`'} varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`AUDI_DA_FECHCREA`'} datetime(0) NULL DEFAULT NULL,
        ${'`AUDI_VC_USERMOD`'} varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
        ${'`AUDI_DA_FECHMOD`'} datetime(0) NULL DEFAULT NULL,
        PRIMARY KEY (${'`USER_IN_CODIGO`'})
    )
    COLLATE='latin1_swedish_ci'
    ;    
    `,

/*    
    UNIQUE INDEX ${'`seg_user_perfil_unique`'} (${'`perfil`'}),
    INDEX ${'`seg_user_perfil_foreign`'} (${'`perfil`'}),
    CONSTRAINT ${'`seg_user_perfil_foreign`'} FOREIGN KEY (${'`perfil`'}) REFERENCES ${'`perfil`'} (${'`id`'}) ON UPDATE NO ACTION ON DELETE CASCADE ,
*/
    "down": `
    DROP TABLE ${'`SEG_USER`'}
    `,
}