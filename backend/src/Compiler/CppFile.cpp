#include <iostream>
#include <string>
using namespace std;

    int add(int*  array,int  b){
return array[0]+b;
}
    int main() {int array[]={386,12,543};

cout<<add(array,150)<<endl;
        
        return 0;
    }