Step 1 

Create a working directory, perhaps `/home/cocomo/ssl`, and then

```
cat > csr.conf <<'EOF'
[ req ]
default_bits       = 2048
prompt             = no
default_md         = sha256
req_extensions     = req_ext
distinguished_name = dn

[ dn ]
C  = IN
ST = Maharashtra
L  = Mumbai
O  = Godrej & Boyce Mfg. Co. Ltd.
OU = Godrej Design Lab
CN = cms-designlab.godrejenterprises.com

[ req_ext ]
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = cms-designlab.godrejenterprises.com
EOF
```


Step 2

```
openssl genpkey -algorithm RSA -out server.key -pkeyopt rsa_keygen_bits:2048
```


Step 3


```
openssl req -new -key server.key -out server.csr -config csr.conf
```

