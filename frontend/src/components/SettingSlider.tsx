import {Box, Grid, Input, Slider, Typography} from "@mui/material";
import {useEffect, useState} from "react";

interface Props {
    label: string;
    defaultValue: number;
    min?: number;
    max?: number;
    disabled?: boolean;
    onChange?: (value: number) => void;
}

const SettingSlider = (p: Props) => {
    const [text, setText] = useState(p.defaultValue.toString());
    const [value, setValue] = useState(p.defaultValue);

    useEffect(() => {
        setValue(p.defaultValue);
        setText(p.defaultValue.toString());
    }, [p.defaultValue]);

    useEffect(() => {
        let newValue = parseInt(text);
        if (isNaN(newValue)) return;
        newValue = Math.min(Math.max(newValue, p.min ?? 0), p.max ?? 100);
        if (newValue === value) return;
        setValue(newValue);
    }, [text]);

    useEffect(() => {
        if (value === p.defaultValue) return;
        p.onChange?.(value);
    }, [value]);

    return (
        <Box>
            <Typography gutterBottom>
                {p.label}
            </Typography>
            <Grid container spacing={2} sx={{alignItems: 'center'}}>
                <Grid size={9}>
                    <Slider
                        disabled={p.disabled}
                        min={p.min}
                        max={p.max}
                        value={value}
                        onChange={(_, v) => {
                            setValue(v);
                            setText(v.toString());
                        }}
                    />
                </Grid>
                <Grid size={3}>
                    <Input
                        value={text}
                        size="small"
                        onChange={(e) => {
                            setText(e.target.value);
                        }}
                        onBlur={() => {
                            setText("" + value)
                        }}
                        inputProps={{
                            step: 1,
                            min: p.min,
                            max: p.max,
                            type: 'number',
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default SettingSlider;