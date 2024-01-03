import { Label, Separator, SizeTokens, Switch, XStack, YStack, styled } from 'tamagui'

export function SwitchWithLabel(
    props: { size: SizeTokens; 
      checked?: boolean; 
      label:string;
      handleDayPick: (day: any) => void; 
    }
  ) {

  const id = props.label;

  return (

    <XStack width={200} alignItems="center" space="$4" >

      <Label
        paddingRight="$0"
        paddingLeft="$4"
        minWidth={90}
        justifyContent="flex-end"
        size={props.size}
        htmlFor={id}
      >

        {props.label}

      </Label>

      <Separator minHeight={20} vertical />

      <Switch id={id} size={props.size} checked={props.checked} $xs={{backgroundColor: "gray"}}
          onCheckedChange={() => props.handleDayPick( props.label )
        }>

        <Switch.Thumb animation="quick" />

      </Switch>

    </XStack>

  )

}
