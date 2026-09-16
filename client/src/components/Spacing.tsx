type SizeProps = {
    size?: string;
}

export default function Spacing({size}:SizeProps){
    return(
        <div className={`${size === 'xs' ? "h-[10px]" : size === 'xl' ? "h-[48px]" : "h-[18px]"}`}/>
    )
}