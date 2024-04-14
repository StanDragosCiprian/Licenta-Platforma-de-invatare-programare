#include <iostream>
#include <string>
using namespace std;

    int get_first_value(int[]  number_list){
return number_list[0];
}
    int main() {
cout<<get_first_value([1, 2, 3])<<endl;
        
        return 0;
    }