import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface props {
    isOpen: boolean;
    onClose: () => any;
    onChange: (string) => any;
}

export default function FormDialog({ isOpen, onChange, onClose }: props) {


    const [ipInput, setIpInput] = useState('');


    return (
        <div>
            <Dialog open={isOpen} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">切换服务端</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        切换到不同服务器数据源
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Server IP"
                        type="string"
                        fullWidth
                        value={ipInput}
                        onChange={e => setIpInput(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        取消
                    </Button>
                    <Button onClick={() => {
                        onClose();
                        onChange(ipInput);
                    }} color="primary">
                        切换
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}